import { createSelector } from "reselect";
import { get } from "lodash";

const tokens = state => get(state, 'tokens.contracts');
const allOrders = state => get(state, 'exchange.allOrders.data', []);

// ----------------------------------------------------------------
// ORDER BOOK

export const orderBookSelector = createSelector(allOrders, tokens, (orders, tokens) => {
    console.log('orderBookSelector', orders, tokens)
    // Do stuff with it...
})