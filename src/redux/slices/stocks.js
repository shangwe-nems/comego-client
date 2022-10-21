import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getStocks, _createStock, _deleteStock, _updateStock } from "../../services/lib/stock"

const initialState = []

export const createStock = createAsyncThunk(
    "stocks/create",
    async ({ dataToSubmit }) => (await _createStock(dataToSubmit)).data
)

export const updateStock = createAsyncThunk(
    "stocks/update",
    async ({_id, dataToSubmit}) => (await _updateStock(_id, dataToSubmit)).data
)

export const deleteStock = createAsyncThunk(
    "stocks/delete",
    async (_id) => (await _deleteStock(_id)).data
)

export const findStocks = createAsyncThunk(
    "stocks/retrieve",
    async () => (await _getStocks()).data
)

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    extraReducers: {
        [createStock.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateStock.fulfilled] : (state, action) => {
            const index = state.findIndex(stock => stock._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteStock.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findStocks.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = stockSlice;

export default reducer

