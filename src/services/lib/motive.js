import apiClient from "../apiClient";

export function _getMotives() {
    return apiClient.get(`/motives/*`)
}

export function _createMotive(dataToSubmit) {
    return apiClient.post(`/motives/`, dataToSubmit)
}

export function _updateMotive(id, dataToSubmit) {
    return apiClient.patch(`/motives/${id}`, dataToSubmit)
}

export function _deleteMotive(id) {
    return apiClient.delete(`/motives/${id}`)
}

