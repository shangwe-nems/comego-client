import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getPermissions, _createPermission, _deletePermission, _updatePermission } from "../../services/lib/permission"

const initialState = []

export const createPermission = createAsyncThunk(
    "permissions/create",
    async ({ dataToSubmit }) => (await _createPermission(dataToSubmit)).data
)

export const updatePermission = createAsyncThunk(
    "permissions/update",
    async ({_id, dataToSubmit}) => (await _updatePermission(_id, dataToSubmit)).data
)

export const deletePermission = createAsyncThunk(
    "permissions/delete",
    async (_id) => (await _deletePermission(_id)).data
)

export const findPermissions = createAsyncThunk(
    "permissions/retrieve",
    async () => (await _getPermissions()).data
)

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    extraReducers: {
        [createPermission.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updatePermission.fulfilled] : (state, action) => {
            const index = state.findIndex(permission => permission._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deletePermission.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findPermissions.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = permissionSlice;

export default reducer

