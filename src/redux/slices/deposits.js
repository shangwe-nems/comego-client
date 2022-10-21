import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getDeposits, _createDeposit, _deleteDeposit, _updateDeposit } from "../../services/lib/deposit"

const initialState = []

export const createDeposit = createAsyncThunk(
    "deposits/create",
    async ({ dataToSubmit }) => (await _createDeposit(dataToSubmit)).data
)

export const updateDeposit = createAsyncThunk(
    "deposits/update",
    async ({_id, dataToSubmit}) => (await _updateDeposit(_id, dataToSubmit)).data
)

export const deleteDeposit = createAsyncThunk(
    "deposits/delete",
    async (_id) => (await _deleteDeposit(_id)).data
)

export const findDeposits = createAsyncThunk(
    "deposits/retrieve",
    async () => (await _getDeposits()).data
)

const depositSlice = createSlice({
    name: 'deposit',
    initialState,
    extraReducers: {
        [createDeposit.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateDeposit.fulfilled] : (state, action) => {
            const index = state.findIndex(deposit => deposit._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteDeposit.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findDeposits.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = depositSlice;

export default reducer

