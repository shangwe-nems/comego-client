import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getTreasurys, _createTreasury, _deleteTreasury, _updateTreasury } from "../../services/lib/treasury"

const initialState = []

export const createTreasury = createAsyncThunk(
    "treasurys/create",
    async ({ dataToSubmit }) => (await _createTreasury(dataToSubmit)).data
)

export const updateTreasury = createAsyncThunk(
    "treasurys/update",
    async ({_id, dataToSubmit}) => (await _updateTreasury(_id, dataToSubmit)).data
)

export const deleteTreasury = createAsyncThunk(
    "treasurys/delete",
    async (_id) => (await _deleteTreasury(_id)).data
)

export const findTreasurys = createAsyncThunk(
    "treasurys/retrieve",
    async () => (await _getTreasurys()).data
)

const treasurySlice = createSlice({
    name: 'treasury',
    initialState,
    extraReducers: {
        [createTreasury.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateTreasury.fulfilled] : (state, action) => {
            const index = state.findIndex(treasury => treasury._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteTreasury.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findTreasurys.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = treasurySlice;

export default reducer

