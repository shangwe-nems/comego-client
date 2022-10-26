import { configureStore } from "@reduxjs/toolkit"
import userReducer from './slices/users'
import sessionReducer from './slices/sessions'
import incomeReducer from './slices/incomes'
import expenseReducer from './slices/expenses'
import clientReducer from './slices/clients'
import motivesReducer from './slices/motives'
import bankReducer from './slices/banks'
import treasuryReducer from './slices/treasurys'
import depositReducer from './slices/deposits'
import invoiceReducer from './slices/invoices'
import permissionReducer from './slices/permissions'
import providerReducer from './slices/providers'
import purchaseReducer from './slices/purchases'
import resultReducer from './slices/results'
import saleReducer from './slices/sales'
import stockReducer from './slices/stocks'
import travelReducer from './slices/travels'
import withdrawReducer from './slices/widthdraws'
import commandeReducer from './slices/commandes'

const reducer = {
    users: userReducer,
    sessions: sessionReducer,
    incomes: incomeReducer,
    expenses: expenseReducer,
    clients: clientReducer,
    motives: motivesReducer,
    deposits: depositReducer,
    invoices: invoiceReducer,
    banks : bankReducer,
    treasurys: treasuryReducer,
    permissions: permissionReducer,
    providers: providerReducer,
    purchases: purchaseReducer,
    results: resultReducer,
    sales: saleReducer,
    stocks: stockReducer,
    travels: travelReducer,
    withdraws: withdrawReducer,
    commandes: commandeReducer
}

const store = configureStore({
    reducer: reducer,
    devTools: true
})

export default store