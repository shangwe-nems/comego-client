import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getProviders, _createProvider, _deleteProvider, _updateProvider } from "../../services/lib/provider"

const initialState = []

export const createProvider = createAsyncThunk(
    "providers/create",
    async ({ dataToSubmit }) => (await _createProvider(dataToSubmit)).data
)

export const updateProvider = createAsyncThunk(
    "providers/update",
    async ({_id, dataToSubmit}) => (await _updateProvider(_id, dataToSubmit)).data
)

export const deleteProvider = createAsyncThunk(
    "providers/delete",
    async (_id) => (await _deleteProvider(_id)).data
)

export const findProviders = createAsyncThunk(
    "providers/retrieve",
    async () => (await _getProviders()).data
)

const providerSlice = createSlice({
    name: 'provider',
    initialState,
    extraReducers: {
        [createProvider.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateProvider.fulfilled] : (state, action) => {
            const index = state.findIndex(provider => provider._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteProvider.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findProviders.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = providerSlice;

export default reducer

