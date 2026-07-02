import type {User} from "./User";

export interface GroupBalance {

    debtor: User;

    creditor: User;

    amount: number;

}