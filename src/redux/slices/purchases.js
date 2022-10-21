import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getPurchases, _createPurchase, _deletePurchase, _updatePurchase } from "../../services/lib/purchase"

const initialState = []

export const createPurchase = createAsyncThunk(
    "purchases/create",
    async ({ dataToSubmit }) => (await _createPurchase(dataToSubmit)).data
)

export const updatePurchase = createAsyncThunk(
    "purchases/update",
    async ({_id, dataToSubmit}) => (await _updatePurchase(_id, dataToSubmit)).data
)

export const deletePurchase = createAsyncThunk(
    "purchases/delete",
    async (_id) => (await _deletePurchase(_id)).data
)

export const findPurchases = createAsyncThunk(
    "purchases/retrieve",
    async () => (await _getPurchases()).data
)

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    extraReducers: {
        [createPurchase.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updatePurchase.fulfilled] : (state, action) => {
            const index = state.findIndex(purchase => purchase._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deletePurchase.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findPurchases.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = purchaseSlice;

export default reducer

