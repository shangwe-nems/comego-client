import apiClient from "../apiClient";

export function _getClients() {
    return apiClient.get(`/clients/*`)
}

export function _createClient(dataToSubmit) {
    return apiClient.post(`/clients/`, dataToSubmit)
}

export function _updateClient(id, dataToSubmit) {
    return apiClient.patch(`/clients/${id}`, dataToSubmit)
}

export function _deleteClient(id) {
    return apiClient.delete(`/clients/${id}`)
}

