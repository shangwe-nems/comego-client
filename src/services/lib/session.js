import apiClient from "../apiClient";


export function _getSessions() {
    return apiClient.get(`/sessions/`)
}

export function _createSession(dataToSubmit) {
    return apiClient.post(`/sessions/`, dataToSubmit)
}

export function _authUser() {
    return apiClient.get(`/me`)
}

export function _deleteSession() {
    return apiClient.delete(`/sessions/`)
}

export function _checkUserPassword(dataToSubmit) {
    return apiClient.post('/sessions/confirm-current-pwd', dataToSubmit)
}

export function _changeUserPassword(dataToSubmit) {
    return apiClient.post(`/sessions/change-password`, dataToSubmit)
}