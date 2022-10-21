import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getMotives, _createMotive, _deleteMotive, _updateMotive } from "../../services/lib/motive"

const initialState = []

export const createMotive = createAsyncThunk(
    "motives/create",
    async ({ dataToSubmit }) => (await _createMotive(dataToSubmit)).data
)

export const updateMotive = createAsyncThunk(
    "motives/update",
    async ({_id, dataToSubmit}) => (await _updateMotive(_id, dataToSubmit)).data
)

export const deleteMotive = createAsyncThunk(
    "motives/delete",
    async (_id) => (await _deleteMotive(_id)).data
)

export const findMotives = createAsyncThunk(
    "motives/retrieve",
    async () => (await _getMotives()).data
)

const motiveSlice = createSlice({
    name: 'motive',
    initialState,
    extraReducers: {
        [createMotive.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateMotive.fulfilled] : (state, action) => {
            const index = state.findIndex(motive => motive._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteMotive.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findMotives.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = motiveSlice;

export default reducer

