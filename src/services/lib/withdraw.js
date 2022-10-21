import apiClient from "../apiClient";

export function _getWithdraws() {
    return apiClient.get(`/withdraws/*`)
}

export function _createWithdraw(dataToSubmit) {
    return apiClient.post(`/withdraws/`, dataToSubmit)
}

export function _updateWithdraw(id, dataToSubmit) {
    return apiClient.patch(`/withdraws/${id}`, dataToSubmit)
}

export function _deleteWithdraw(id) {
    return apiClient.delete(`/withdraws/${id}`)
}

