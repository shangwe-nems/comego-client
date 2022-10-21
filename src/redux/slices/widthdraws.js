import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getWithdraws, _createWithdraw, _deleteWithdraw, _updateWithdraw } from "../../services/lib/withdraw"

const initialState = []

export const createWithdraw = createAsyncThunk(
    "withdraws/create",
    async ({ dataToSubmit }) => (await _createWithdraw(dataToSubmit)).data
)

export const updateWithdraw = createAsyncThunk(
    "withdraws/update",
    async ({_id, dataToSubmit}) => (await _updateWithdraw(_id, dataToSubmit)).data
)

export const deleteWithdraw = createAsyncThunk(
    "withdraws/delete",
    async (_id) => (await _deleteWithdraw(_id)).data
)

export const findWithdraws = createAsyncThunk(
    "withdraws/retrieve",
    async () => (await _getWithdraws()).data
)

const withdrawSlice = createSlice({
    name: 'withdraw',
    initialState,
    extraReducers: {
        [createWithdraw.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateWithdraw.fulfilled] : (state, action) => {
            const index = state.findIndex(withdraw => withdraw._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteWithdraw.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findWithdraws.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = withdrawSlice;

export default reducer

