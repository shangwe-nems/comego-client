import apiClient from "../apiClient";

export function _getProviders() {
    return apiClient.get(`/providers/*`)
}

export function _createProvider(dataToSubmit) {
    return apiClient.post(`/providers/`, dataToSubmit)
}

export function _updateProvider(id, dataToSubmit) {
    return apiClient.patch(`/providers/${id}`, dataToSubmit)
}

export function _deleteProvider(id) {
    return apiClient.delete(`/providers/${id}`)
}

