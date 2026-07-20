import { useApiMutation, useApiQuery } from '../services';

export interface PayrollPicklistValue {
  _id: string;
  title: string;
  value: string;
  color?: string;
}

export interface PayrollEmployee {
  _id: string;
  name: string;
  email?: string;
}

export type PayrollStatus = 'paid' | 'unpaid';

export interface Payroll {
  _id: string;
  employee?: PayrollEmployee;
  /** Kis maheene ki payroll hai (backend ISO date bhejta hai). */
  month: string;
  basicSalary: number;
  allowances: number;
  bonus: number;
  overtime: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  paymentMode?: PayrollPicklistValue;
  paymentDate?: string;
  notes?: string;
  createdBy?: PayrollEmployee;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollsMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetPayrollsResponse {
  data: Payroll[];
  meta: PayrollsMeta;
}

export interface GetPayrollsParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /payrolls (list) ----------

export const usePayrolls = (params?: GetPayrollsParams) => {
  return useApiQuery<GetPayrollsResponse>(
    ['payrolls', params],
    {
      method: 'GET',
      endPoint: 'payrolls',
      requestConfig: { params },
    },
  );
};

// ---------- GET /payrolls/:id (single) ----------

export const usePayroll = (id?: string) => {
  return useApiQuery<{ data: Payroll }>(
    ['payroll', id],
    {
      method: 'GET',
      endPoint: `payrolls/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /payrolls (create) ----------

export interface CreatePayrollPayload {
  /** Picklist / user references — sirf _id bheja jata hai. */
  employee?: string;
  month: string;
  basicSalary?: number;
  allowances?: number;
  bonus?: number;
  overtime?: number;
  deductions?: number;
  netPay?: number;
  status?: PayrollStatus;
  paymentMode?: string;
  paymentDate?: string;
  notes?: string;
}

export interface CreatePayrollResponse {
  data: Payroll;
  message?: string;
}

export const useCreatePayroll = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    CreatePayrollResponse,
    CreatePayrollPayload
  >({
    method: 'POST',
    endPoint: 'payrolls',
  });

  const createPayroll = (body: CreatePayrollPayload) => mutateAsync({ body });

  return { createPayroll, isPending, isError, error };
};

// ---------- PATCH /payrolls/:id (update) ----------

export interface UpdatePayrollPayload extends CreatePayrollPayload {
  id: string;
}

export interface UpdatePayrollResponse {
  data: Payroll;
  message?: string;
}

export const useUpdatePayroll = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    UpdatePayrollResponse,
    CreatePayrollPayload
  >({
    method: 'PATCH',
    endPoint: 'payrolls',
  });

  // Baaki hooks ki tarhan id endPoint mein jati hai — mutation variables mein
  // `id` naam ka koi field support nahi hota.
  const updatePayroll = ({ id, ...body }: UpdatePayrollPayload) =>
    mutateAsync({ endPoint: `payrolls/${id}`, body });

  return { updatePayroll, isPending, isError, error };
};

// ---------- DELETE /payrolls/:id ----------

export interface DeletePayrollResponse {
  success: boolean;
  message: string;
}

export const useDeletePayroll = () => {
  const { mutateAsync, isPending, isError, error } =
    useApiMutation<DeletePayrollResponse>({
      method: 'DELETE',
      endPoint: 'payrolls',
    });

  const deletePayroll = ({ id }: { id: string }) =>
    mutateAsync({ endPoint: `payrolls/${id}` });

  return { deletePayroll, isPending, isError, error };
};
