import { createSelector } from "reselect";
import { get } from "lodash";
import moment from "moment";
import { ethers } from "ethers";

const tokens = state => get(state, 'tokens.contracts');
const allOrders = state => get(state, 'exchange.allOrders.data', []);

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
    allOrders,
    tokens,
    (orders, tokens) => {
        // Check if there are both tokens present
        if (!tokens[0] || !tokens[1]) { return }

        // Filter orders by selected tokens
        orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address);
        orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address);


        orders = decorateOrderBookOrders(orders, tokens)
        console.log(orders)
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
