import api from "./api";

export const getSettlements = async (groupId: number) => {
    const response = await api.get(`/api/groups/${groupId}/settlements`);
    return response.data;
};
