import apiClient from "../apiClient";

export function _getCommandes() {
    return apiClient.get(`/commandes/*`)
}

export function _createCommande(dataToSubmit) {
    return apiClient.post(`/commandes/`, dataToSubmit)
}

export function _updateCommande(id, dataToSubmit) {
    return apiClient.patch(`/commandes/${id}`, dataToSubmit)
}

export function _cancelCommande(id) {
    return apiClient.put(`/commandes/${id}`, {})
}


