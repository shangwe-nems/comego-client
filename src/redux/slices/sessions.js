import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getSessions, _authUser, _changeUserPassword, _checkUserPassword, _createSession, _deleteSession } from "../../services/lib/session"
import { _updateUser } from "../../services/lib/user"

const initialState = {
    auth : null,
    authUser : null,
    authSessions : []
}

export const login = createAsyncThunk(
    "session/login",
    async (dataToSubmit) => (await _createSession(dataToSubmit)).data
)

export const readSessions = createAsyncThunk(
    "session/retrieve",
    async () => (await _getSessions()).data
)

export const authUser = createAsyncThunk(
    "session/auth",
    async () => (await _authUser()).data
)

export const logout = createAsyncThunk(
    "session/logout",
    async () => (await _deleteSession()).data
)

export const updateUserProfile = createAsyncThunk(
    "session/update_profile",
    async ({_id, dataToSubmit}) => (await _updateUser(_id, dataToSubmit)).data
)

export const checkPassword = createAsyncThunk(
    "session/check_pwd",
    async (dataToSubmit) => (await _checkUserPassword(dataToSubmit)).data
)

export const changePassword = createAsyncThunk(
    "session/change_pwd",
    async (dataToSubmit) => (await _changeUserPassword(dataToSubmit)).data
)

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    extraReducers: {
        [login.fulfilled] : (state, action) => {
            return { ...state, auth: action.payload }
        },
        [readSessions.fulfilled] : (state, action) => {
            return { ...state, authSessions: action.payload }
        },
        [authUser.fulfilled] : (state, action) => {
            return { ...state, authUser: action.payload}
        },
        [logout.fulfilled] : (state, action) => {
            return { ...state, authUser: null, authSessions: [], auth: null }
        },
        [updateUserProfile.fulfilled] : (state, action) => {
            return { ...state, authUser: { ...state.authUser, ...action.payload}}
        },
        [checkPassword.fulfilled] : (state, action) => {
            return { ...state }
        },
        [changePassword] : (state, action) => {
            return { ...state }
        }

    }
})

const { reducer } = sessionSlice;

export default reducer

