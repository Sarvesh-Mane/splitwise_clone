import type {User} from "./User";
import type {Split} from "./Split";

export interface ExpenseDetail {
    id: number;
    expenseName: string;
    amount: number;
    paidBy: User;
    splitType: string;
    groupId: number;
    splits: Split[];
    category: string;
}
