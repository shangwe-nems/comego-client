import apiClient from "../apiClient";

export function _getExpenses() {
    return apiClient.get(`/expenses/*`)
}

export function _createExpense(dataToSubmit) {
    return apiClient.post(`/expenses/`, dataToSubmit)
}

export function _updateExpense(id, dataToSubmit) {
    return apiClient.patch(`/expenses/${id}`, dataToSubmit)
}

export function _deleteExpense(id) {
    return apiClient.delete(`/expenses/${id}`)
}

