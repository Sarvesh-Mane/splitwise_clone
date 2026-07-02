import api from "./api";


export const getGroups = async () => {
    const response = await api.get('/api/groups');
    return response.data;
};


export const getGroup = async (id: number) => {
    const response = await api.get(`/api/groups/${id}`);
    return response.data;
};


export const getGroupDetail = async (id: number) => {
    const response = await api.get(`/api/groups/${id}/detail`);
    return response.data;
};


export const createGroup = async (name: string, memberIds: number[]) => {
    const response = await api.post('/api/groups', {name, memberIds});
    return response.data;
};