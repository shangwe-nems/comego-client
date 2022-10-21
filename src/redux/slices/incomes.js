import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getIncomes, _createIncome, _deleteIncome, _updateIncome } from "../../services/lib/income"

const initialState = []

export const createIncome = createAsyncThunk(
    "incomes/create",
    async ({ dataToSubmit }) => (await _createIncome(dataToSubmit)).data
)

export const updateIncome = createAsyncThunk(
    "incomes/update",
    async ({_id, dataToSubmit}) => (await _updateIncome(_id, dataToSubmit)).data
)

export const deleteIncome = createAsyncThunk(
    "incomes/delete",
    async (_id) => (await _deleteIncome(_id)).data
)

export const findIncomes = createAsyncThunk(
    "incomes/retrieve",
    async () => (await _getIncomes()).data
)

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    extraReducers: {
        [createIncome.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateIncome.fulfilled] : (state, action) => {
            const index = state.findIndex(income => income._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteIncome.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findIncomes.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = incomeSlice;

export default reducer

