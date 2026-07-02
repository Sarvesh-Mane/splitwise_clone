export interface GroupInvitation {
    id: number;
    groupId: number;
    groupName: string;
    inviter: { id: number; name: string; email: string };
    invitee?: { id: number; name: string; email: string };
    inviteeEmail: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    createdAt: string;
}
