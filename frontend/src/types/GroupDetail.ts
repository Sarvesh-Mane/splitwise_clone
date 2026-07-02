import type {User} from "./User";
import type {Expense} from "./Expense";
import type {GroupBalance} from "./GroupBalance";
import type {Settlement} from "./Settlement";

export interface GroupDetail {

    id: number;

    name: string;

    members: User[];

    expenses: Expense[];

    groupBalances: GroupBalance[];

    settlements: Settlement[];

}