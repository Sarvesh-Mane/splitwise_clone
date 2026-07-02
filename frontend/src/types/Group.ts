import type {User} from './User'

export interface Group {
    id: number;
    name: string;
    members: User[];

}