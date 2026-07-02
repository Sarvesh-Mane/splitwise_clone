import api from "./api";

export interface CreateExpenseRequest {
    expenseName: string;
    paidByID: number;
    amount: number;
    splitType: string;
    participantIDs: number[];
    values: number[];
    category?: string;
}

export const getExpenses = async (groupId: number) => {
    const response = await api.get(`/api/groups/${groupId}/expenses`);
    return response.data;
};

export const getExpense = async (expenseId: number) => {
    const response = await api.get(`/api/expenses/${expenseId}`);
    return response.data;
};

export const createExpense = async (groupId: number, data: CreateExpenseRequest) => {
    const response = await api.post(`/api/groups/${groupId}/expenses`, data);
    return response.data;
};

export const updateExpense = async (groupId: number, expenseId: number, data: CreateExpenseRequest) => {
    const response = await api.put(`/api/groups/${groupId}/expenses/${expenseId}`, data);
    return response.data;
};

export const deleteExpense = async (groupId: number, expenseId: number) => {
    const response = await api.delete(`/api/groups/${groupId}/expenses/${expenseId}`);
    return response.data;
};