import apiClient from "../apiClient";

export function _getStocks() {
    return apiClient.get(`/stocks/*`)
}

export function _createStock(dataToSubmit) {
    return apiClient.post(`/stocks/`, dataToSubmit)
}

export function _updateStock(id, dataToSubmit) {
    return apiClient.patch(`/stocks/${id}`, dataToSubmit)
}

export function _deleteStock(id) {
    return apiClient.delete(`/stocks/${id}`)
}

