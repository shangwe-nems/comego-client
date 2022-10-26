import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getCommandes, _createCommande, _updateCommande, _cancelCommande } from "../../services/lib/commande"

const initialState = []

export const createCommande = createAsyncThunk(
    "commandes/create",
    async ({ dataToSubmit }) => (await _createCommande(dataToSubmit)).data
)

export const updateCommande = createAsyncThunk(
    "commandes/update",
    async ({_id, dataToSubmit}) => (await _updateCommande(_id, dataToSubmit)).data
)

export const cancelCommande = createAsyncThunk(
    "commandes/cancel",
    async (_id) => (await _cancelCommande(_id)).data
)

export const findCommandes = createAsyncThunk(
    "commandes/retrieve",
    async () => (await _getCommandes()).data
)

const commandeSlice = createSlice({
    name: 'commandes',
    initialState,
    extraReducers: {
        [createCommande.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateCommande.fulfilled] : (state, action) => {
            const index = state.findIndex(commande => commande._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [cancelCommande.fulfilled] : (state, action) => {
            const index = state.findIndex(commande => commande._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [findCommandes.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = commandeSlice;

export default reducer

