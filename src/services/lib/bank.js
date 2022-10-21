import apiClient from "../apiClient";

export function _getBanks() {
    return apiClient.get(`/finances/bank`)
}

export function _createBank(dataToSubmit) {
    return apiClient.post(`/finances/`, dataToSubmit)
}

export function _updateBank(id, dataToSubmit) {
    return apiClient.patch(`/finances/${id}`, dataToSubmit)
}

export function _deleteBank(id) {
    return apiClient.delete(`/finances/${id}`)
}

