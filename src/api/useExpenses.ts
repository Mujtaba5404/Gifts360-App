import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from '../services';

export interface Picklist {
  _id: string;
  title: string;
  value: string;
  color?: string;
  parentPicklist?: string;
  meta?: { isFixedCost?: boolean };
}

export interface Expense {
  _id: string;
  date: string;
  payee: string;
  paymentMode?: string;
  paymentReference?: string;
  description: string;
  type: Picklist;
  category: Picklist;
  amount: number;
}

export interface ExpensesMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetExpensesResponse {
  data: Expense[];
  meta: ExpensesMeta;
}

export interface GetExpensesParams {
  page?: number;
  pageSize?: number;
}

// ---------- GET /expenses (list) ----------

export const useExpenses = (params?: GetExpensesParams) => {
  return useApiQuery<GetExpensesResponse>(
    ['expenses', params],
    {
      method: 'GET',
      endPoint: '/expenses',
      requestConfig: { params },
    },
  );
};

// ---------- POST /expenses (create) ----------

export interface CreateExpenseRequestBody {
  payee: string;
  paymentMode: string;
  paymentReference?: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  date: string;
}

export interface CreateExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
}

interface CreateExpenseMutationPayload {
  body: CreateExpenseRequestBody;
}

export const useCreateExpense = () => {
  const mutation = useApiMutation<CreateExpenseResponse, CreateExpenseRequestBody>({
    method: 'POST',
    endPoint: '/expenses',
  });

  const createExpense = useCallback(
    ({ body }: CreateExpenseMutationPayload) => mutation.mutateAsync({ body }),
    [mutation],
  );

  return { ...mutation, createExpense };
};