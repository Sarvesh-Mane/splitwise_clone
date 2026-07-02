import api from "./api";

export const inviteMember = async (groupId: number, email: string) => {
    const response = await api.post(`/api/groups/${groupId}/invitations`, {email});
    return response.data;
};

export const getGroupInvitations = async (groupId: number) => {
    const response = await api.get(`/api/groups/${groupId}/invitations`);
    return response.data;
};

export const getPendingInvitations = async () => {
    const response = await api.get('/api/invitations/pending');
    return response.data;
};

export const acceptInvitation = async (invitationId: number) => {
    const response = await api.post(`/api/invitations/${invitationId}/accept`);
    return response.data;
};

export const declineInvitation = async (invitationId: number) => {
    const response = await api.post(`/api/invitations/${invitationId}/decline`);
    return response.data;
};
