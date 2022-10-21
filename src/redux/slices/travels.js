import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getTravels, _createTravel, _deleteTravel, _updateTravel } from "../../services/lib/travel"

const initialState = []

export const createTravel = createAsyncThunk(
    "travels/create",
    async ({ dataToSubmit }) => (await _createTravel(dataToSubmit)).data
)

export const updateTravel = createAsyncThunk(
    "travels/update",
    async ({_id, dataToSubmit}) => (await _updateTravel(_id, dataToSubmit)).data
)

export const deleteTravel = createAsyncThunk(
    "travels/delete",
    async (_id) => (await _deleteTravel(_id)).data
)

export const findTravels = createAsyncThunk(
    "travels/retrieve",
    async () => (await _getTravels()).data
)

const travelSlice = createSlice({
    name: 'travel',
    initialState,
    extraReducers: {
        [createTravel.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateTravel.fulfilled] : (state, action) => {
            const index = state.findIndex(travel => travel._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteTravel.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findTravels.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = travelSlice;

export default reducer

