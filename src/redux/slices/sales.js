import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getSales, _createSale, _deleteSale, _updateSale } from "../../services/lib/sale"

const initialState = []

export const createSale = createAsyncThunk(
    "sales/create",
    async ({ dataToSubmit }) => (await _createSale(dataToSubmit)).data
)

export const updateSale = createAsyncThunk(
    "sales/update",
    async ({_id, dataToSubmit}) => (await _updateSale(_id, dataToSubmit)).data
)

export const deleteSale = createAsyncThunk(
    "sales/delete",
    async (_id) => (await _deleteSale(_id)).data
)

export const findSales = createAsyncThunk(
    "sales/retrieve",
    async () => (await _getSales()).data
)

const saleSlice = createSlice({
    name: 'sale',
    initialState,
    extraReducers: {
        [createSale.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateSale.fulfilled] : (state, action) => {
            const index = state.findIndex(sale => sale._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteSale.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findSales.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = saleSlice;

export default reducer

