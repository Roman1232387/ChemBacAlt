import axiosInstance from './axiosInstance';

interface HealthResponse {
    status: string;
    timestamp: string;
    service: string;
}

export const HealthService = {
    check: async (): Promise<string> => {
        const response = await axiosInstance.get<HealthResponse>('/health');
        return response.data.status;
    },
};
