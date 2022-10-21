import apiClient from "../apiClient";

export function _getReportResults(dataToSubmit) {
    return apiClient.post(`/reports/result`, dataToSubmit)
}

export function _getDashboardResult(dataToSubmit) {
    return apiClient.post(`/reports/dashboard`, dataToSubmit)
}


