import apiClient from "../apiClient";

export function _getTravels() {
    return apiClient.get(`/travels/*`)
}

export function _createTravel(dataToSubmit) {
    return apiClient.post(`/travels/`, dataToSubmit)
}

export function _updateTravel(id, dataToSubmit) {
    return apiClient.patch(`/travels/${id}`, dataToSubmit)
}

export function _deleteTravel(id) {
    return apiClient.delete(`/travels/${id}`)
}

