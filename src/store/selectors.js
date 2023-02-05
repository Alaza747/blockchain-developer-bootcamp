import { createSelector } from "reselect";
import { get, groupBy, reject, maxBy, minBy } from "lodash";
import moment from "moment";
import { ethers } from "ethers";

const tokens = state => get(state, 'tokens.contracts');
const allOrders = state => get(state, 'exchange.allOrders.data', []);
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
const filledOrders = state => get(state, 'exchange.filledOrders.data', []);

const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
        const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
        return (orderFilled || orderCancelled)
    })

    return openOrders

}

const GREEN = '#25CE8F'
const RED = '#F45353'

// General decorateOrder function to populate the order with base data (e.g. timestamp, amount, price)
const decorateOrder = (order, tokens) => {

    let token0Amount, token1Amount

    if (order.tokenGive === tokens[1].address) {
        token0Amount = order.amountGive
        token1Amount = order.amountGet
    } else {
        token0Amount = order.amountGet
        token1Amount = order.amountGive
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = (token1Amount / token0Amount)
    tokenPrice = Math.round(tokenPrice * precision) / precision

    // Populate the orders with amount
    return ({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        tokenPrice: tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('HH:mm:ss DD-MM-YYYY')
    })
}

// ----------------------------------------------------------------
// ORDER BOOK

export const orderBookSelector = createSelector(
    openOrders,
    tokens,
    (orders, tokens) => {
        // Check if there are both tokens present
        if (!tokens[0] || !tokens[1]) { return }

        // Filter orders by selected tokens
        orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address);
        orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address);

        orders = decorateOrderBookOrders(orders, tokens)

        // Group by the order Type
        orders = groupBy(orders, 'orderType')

        // Fetch all buy orders
        const buyOrders = get(orders, 'buy', [])

        // Sort the buy orders by token price
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
        }

        // Fetch all sell orders
        const sellOrders = get(orders, 'sell', [])

        // Sort the sell orders by token price
        orders = {
            ...orders,
            sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
        }

        return orders
    }
)

// Function to wrap the decorateOrderBook() and decorateOrderBookOrders()
const decorateOrderBookOrders = (orders, tokens) => {
    return (
        orders.map((order) => {
            order = decorateOrder(order, tokens);
            order = decorateOrderBookOrder(order, tokens);
            return (order)
        })
    )
}

// Additional decorating function to populate orders with order type
const decorateOrderBookOrder = (order, tokens) => {
    const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
    })
}

// ----------------------------------------------------------------
// PRICE CHART

export const priceChartSelector = createSelector(
    filledOrders,
    tokens,
    (orders, tokens) => {
        if (!tokens || !tokens[1]) { return }

        // Filter the filled orders by selected tokens
        orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address);
        orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address);

        // Decorate the filled orders - add display attributes
        orders = orders.map((o) => decorateOrder(o, tokens))

        // Sort the orders by timestamp
        orders = orders.sort((a, b) => a.timestamp - b.timestamp)

        // Fetching second last and last filled orders
        let secondLastOrder, lastOrder
        [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

        const lastPrice = get(lastOrder, 'tokenPrice', 0)
        const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

        return ({
            lastPrice: lastPrice,
            lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
            series: [{
                data: buildGraphData(orders)
            }]
        })
    }
)


const buildGraphData = (orders) => {
    // Group by date
    orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

    const hours = Object.keys(orders)

    // Build the graph series
    const graphData = hours.map((hour) => {
        // Fetch all orders for this hour
        const group = orders[hour]

        // Calculate the prices: open, high, low, close
        const open = group[0]
        const high = maxBy(group, 'tokenPrice')
        const low = minBy(group, 'tokenPrice')
        const close = group[group.length - 1]


        return ({
            x: new Date(hour),
            y: [
                open.tokenPrice,
                high.tokenPrice,
                low.tokenPrice,
                close.tokenPrice
            ]
        })
    })

    return graphData
}