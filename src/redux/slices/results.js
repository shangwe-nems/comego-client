import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getReportResults } from "../../services/lib/result"

const initialState = []

export const findResults = createAsyncThunk(
    "results/retrieve",
    async (dataToSubmit) => (await _getReportResults(dataToSubmit)).data
)

const resultSlice = createSlice({
    name: 'result',
    initialState,
    extraReducers: {
        [findResults.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = resultSlice;

export default reducer

