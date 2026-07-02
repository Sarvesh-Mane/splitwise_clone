import type {Group} from './Group';
import type {GroupInvitation} from './GroupInvitation';

export interface BalanceSummary {
    groupName: string;
    groupId: number;
    otherUser: { id: number; name: string; email: string };
    amount: number;   // positive = they owe you, negative = you owe them
}

export interface Dashboard {
    myGroups: Group[];
    pendingInvitations: GroupInvitation[];
    balances: BalanceSummary[];
}
