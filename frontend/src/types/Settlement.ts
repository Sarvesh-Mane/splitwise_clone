import type {User} from "./User";

export interface Settlement {

    from: User;

    to: User;

    amount: number;

}