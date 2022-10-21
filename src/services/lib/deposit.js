import apiClient from "../apiClient";

export function _getDeposits() {
    return apiClient.get(`/deposits/*`)
}

export function _createDeposit(dataToSubmit) {
    return apiClient.post(`/deposits/`, dataToSubmit)
}

export function _updateDeposit(id, dataToSubmit) {
    return apiClient.patch(`/deposits/${id}`, dataToSubmit)
}

export function _deleteDeposit(id) {
    return apiClient.delete(`/deposits/${id}`)
}

