import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getInvoices, _createInvoice, _updateInvoice, _cancelInvoice } from "../../services/lib/invoice"

const initialState = []

export const createInvoice = createAsyncThunk(
    "invoices/create",
    async ({ dataToSubmit }) => (await _createInvoice(dataToSubmit)).data
)

export const updateInvoice = createAsyncThunk(
    "invoices/update",
    async ({_id, dataToSubmit}) => (await _updateInvoice(_id, dataToSubmit)).data
)

export const cancelInvoice = createAsyncThunk(
    "invoices/cancel",
    async (_id) => (await _cancelInvoice(_id)).data
)

export const findInvoices = createAsyncThunk(
    "invoices/retrieve",
    async () => (await _getInvoices()).data
)

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    extraReducers: {
        [createInvoice.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateInvoice.fulfilled] : (state, action) => {
            const index = state.findIndex(invoice => invoice._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [cancelInvoice.fulfilled] : (state, action) => {
            const index = state.findIndex(invoice => invoice._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [findInvoices.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = invoiceSlice;

export default reducer

