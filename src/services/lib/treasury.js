import apiClient from "../apiClient";

export function _getTreasurys() {
    return apiClient.get(`/finances/treasury`)
}

export function _createTreasury(dataToSubmit) {
    return apiClient.post(`/finances/`, dataToSubmit)
}

export function _updateTreasury(id, dataToSubmit) {
    return apiClient.patch(`/finances/${id}`, dataToSubmit)
}

export function _deleteTreasury(id) {
    return apiClient.delete(`/finances/${id}`)
}

