import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getBanks, _createBank, _deleteBank, _updateBank } from "../../services/lib/bank"

const initialState = []

export const createBank = createAsyncThunk(
    "banks/create",
    async ({ dataToSubmit }) => (await _createBank(dataToSubmit)).data
)

export const updateBank = createAsyncThunk(
    "banks/update",
    async ({_id, dataToSubmit}) => (await _updateBank(_id, dataToSubmit)).data
)

export const deleteBank = createAsyncThunk(
    "banks/delete",
    async (_id) => (await _deleteBank(_id)).data
)

export const findBanks = createAsyncThunk(
    "banks/retrieve",
    async () => (await _getBanks()).data
)

const bankSlice = createSlice({
    name: 'bank',
    initialState,
    extraReducers: {
        [createBank.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateBank.fulfilled] : (state, action) => {
            const index = state.findIndex(bank => bank._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteBank.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findBanks.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = bankSlice;

export default reducer

