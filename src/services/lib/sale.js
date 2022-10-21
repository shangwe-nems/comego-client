import apiClient from "../apiClient";

export function _getSales() {
    return apiClient.get(`/sales/*`)
}

export function _createSale(dataToSubmit) {
    return apiClient.post(`/sales/`, dataToSubmit)
}

export function _updateSale(id, dataToSubmit) {
    return apiClient.patch(`/sales/${id}`, dataToSubmit)
}

export function _deleteSale(id) {
    return apiClient.delete(`/sales/${id}`)
}

