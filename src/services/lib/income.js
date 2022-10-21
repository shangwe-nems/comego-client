import apiClient from "../apiClient";

export function _getIncomes() {
    return apiClient.get(`/incomes/*`)
}

export function _createIncome(dataToSubmit) {
    return apiClient.post(`/incomes/`, dataToSubmit)
}

export function _updateIncome(id, dataToSubmit) {
    return apiClient.patch(`/incomes/${id}`, dataToSubmit)
}

export function _deleteIncome(id) {
    return apiClient.delete(`/incomes/${id}`)
}

