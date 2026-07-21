// EditPayroll.tsx
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { usePayroll, useUpdatePayroll } from '../../api/usePayrolls';
import { RootStackParamList } from '../../navigation/types';
import PayrollForm, { PayrollFormValues } from './PayrollForm';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditPayrollRoute = RouteProp<RootStackParamList, 'EditPayroll'>;

const EditPayroll = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditPayrollRoute>();
  const queryClient = useQueryClient();

  const payrollId = route.params?.payrollId;

  const { updatePayroll, isPending } = useUpdatePayroll();
  const {
    data: payrollData,
    isLoading: isLoadingPayroll,
    isError: isPayrollError,
  } = usePayroll(payrollId);

  const initialValues = useMemo(() => {
    if (!payrollData) return undefined;

    const row: any = (payrollData as any).data ?? (payrollData as any);

    return {
      employeeId: row.employee?._id ?? row.employee ?? '',
      month: row.month ? new Date(row.month) : new Date(),
      salary: String(row.salary ?? ''),
      arrears: String(row.arrears ?? ''),
      deduction: String(row.deduction ?? ''),
      tax: String(row.tax ?? ''),
      notes: row.notes ?? '',
    };
  }, [payrollData]);

  const onSubmit = async (values: PayrollFormValues) => {
    if (!payrollId) {
      Toast.show({ type: 'error', text1: 'Missing payroll id' });
      return;
    }

    try {
      const res = await updatePayroll({
        id: payrollId,
        employee: values.employeeId,
        month: values.month.toISOString(),
        salary: Number(values.salary) || 0,
        arrears: Number(values.arrears) || 0,
        deduction: Number(values.deduction) || 0,
        tax: Number(values.tax) || 0,
        netSalary: values.netSalary,
        notes: values.notes,
      });

      await queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      await queryClient.invalidateQueries({ queryKey: ['payroll', payrollId] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'Payroll updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not update payroll',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <PayrollForm
      headerText="Edit Payroll"
      submitText="Update Payroll"
      submittingText="Updating..."
      initialValues={initialValues}
      isLoadingInitial={isLoadingPayroll || !initialValues}
      hasLoadError={isPayrollError}
      loadErrorText="Could not load this payroll."
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default EditPayroll;