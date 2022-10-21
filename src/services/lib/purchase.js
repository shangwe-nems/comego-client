import apiClient from "../apiClient";

export function _getPurchases() {
    return apiClient.get(`/purchases/*`)
}

export function _createPurchase(dataToSubmit) {
    return apiClient.post(`/purchases/`, dataToSubmit)
}

export function _updatePurchase(id, dataToSubmit) {
    return apiClient.patch(`/purchases/${id}`, dataToSubmit)
}

export function _deletePurchase(id) {
    return apiClient.delete(`/purchases/${id}`)
}

