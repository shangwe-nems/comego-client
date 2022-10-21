import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getExpenses, _createExpense, _deleteExpense, _updateExpense } from "../../services/lib/expense"

const initialState = []

export const createExpense = createAsyncThunk(
    "expenses/create",
    async ({ dataToSubmit }) => (await _createExpense(dataToSubmit)).data
)

export const updateExpense = createAsyncThunk(
    "expenses/update",
    async ({_id, dataToSubmit}) => (await _updateExpense(_id, dataToSubmit)).data
)

export const deleteExpense = createAsyncThunk(
    "expenses/delete",
    async (_id) => (await _deleteExpense(_id)).data
)

export const findExpenses = createAsyncThunk(
    "expenses/retrieve",
    async () => (await _getExpenses()).data
)

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    extraReducers: {
        [createExpense.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateExpense.fulfilled] : (state, action) => {
            const index = state.findIndex(expense => expense._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteExpense.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findExpenses.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = expenseSlice;

export default reducer

