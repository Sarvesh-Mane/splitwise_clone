import type {User} from "./User";

export interface Expense {
    id: number;
    expenseName: string;
    amount: number;
    paidBy: User;
    splitType: string;
    category: string;

}