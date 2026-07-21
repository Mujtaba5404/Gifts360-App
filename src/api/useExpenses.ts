import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from '../services';

export interface Picklist {
  _id: string;
  title: string;
  value: string;
  color?: string;
  scope?: string;
  resource?: string;
  field?: string;
  parentPicklist?: string | null;
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
  sort?: string;
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

// ---------- PUT /expenses/:id (update) ----------


export type UpdateExpenseRequestBody = Partial<CreateExpenseRequestBody>;

export interface UpdateExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
}

interface UpdateExpenseMutationPayload {
  id: string;
  body: UpdateExpenseRequestBody;
}

export const useUpdateExpense = () => {
  const mutation = useApiMutation<UpdateExpenseResponse, UpdateExpenseRequestBody>({
    method: 'PATCH',
    endPoint: '/expenses',
  });

 const updateExpense = useCallback(
  ({ id, body }: UpdateExpenseMutationPayload) =>
    mutation.mutateAsync({ endPoint: `expenses/${id}`, body }),
  [mutation],
);

  return { ...mutation, updateExpense };
};

// ---------- DELETE /expenses/:id (delete) ----------

export interface DeleteExpenseResponse {
  success: boolean;
  message: string;
}

interface DeleteExpenseMutationPayload {
  id: string;
}

export const useDeleteExpense = () => {
  const mutation = useApiMutation<DeleteExpenseResponse>({
    method: 'DELETE',
    endPoint: '/expenses',
  });

  const deleteExpense = useCallback(
    ({ id }: DeleteExpenseMutationPayload) =>
      mutation.mutateAsync({ endPoint: `/expenses/${id}` }),
    [mutation],
  );

  return { ...mutation, deleteExpense };
};