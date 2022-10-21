import apiClient from "../apiClient";

export function _getUser(id) {
    return apiClient.get(`/users/${id}`)
}

export function _getUsers() {
    return apiClient.get(`/users/*`)
}

export function _createUser(dataToSubmit) {
    return apiClient.post(`/users/`, dataToSubmit)
}

export function _updateUser(id, dataToSubmit) {
    return apiClient.patch(`/users/${id}`, dataToSubmit)
}

export function _deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
}

export function _updateUserPermissions(id, dataToSubmit) {
    return apiClient.put(`/users/${id}/permissions`, dataToSubmit)
}

