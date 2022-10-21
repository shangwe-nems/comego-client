import apiClient from "../apiClient";

export function _getInvoices() {
    return apiClient.get(`/invoices/*`)
}

export function _createInvoice(dataToSubmit) {
    return apiClient.post(`/invoices/`, dataToSubmit)
}

export function _updateInvoice(id, dataToSubmit) {
    return apiClient.patch(`/invoices/${id}`, dataToSubmit)
}

export function _cancelInvoice(id) {
    return apiClient.put(`/invoices/${id}`, {})
}

export function _getTodayCash() {
    return apiClient.post(`/invoices/today-cash`)
}

