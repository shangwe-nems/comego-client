import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getClients, _createClient, _deleteClient, _updateClient } from "../../services/lib/client"

const initialState = []

export const createClient = createAsyncThunk(
    "clients/create",
    async ({ dataToSubmit }) => (await _createClient(dataToSubmit)).data
)

export const updateClient = createAsyncThunk(
    "clients/update",
    async ({_id, dataToSubmit}) => (await _updateClient(_id, dataToSubmit)).data
)

export const deleteClient = createAsyncThunk(
    "clients/delete",
    async (_id) => (await _deleteClient(_id)).data
)

export const findClients = createAsyncThunk(
    "clients/retrieve",
    async () => (await _getClients()).data
)

const clientSlice = createSlice({
    name: 'client',
    initialState,
    extraReducers: {
        [createClient.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateClient.fulfilled] : (state, action) => {
            const index = state.findIndex(client => client._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteClient.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findClients.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = clientSlice;

export default reducer

