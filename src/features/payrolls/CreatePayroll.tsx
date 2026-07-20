import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useCreatePayroll } from '../../api/usePayrolls';
import { RootStackParamList } from '../../navigation/types';
import PayrollForm, { PayrollFormValues } from './PayrollForm';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CreatePayroll = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createPayroll, isPending } = useCreatePayroll();

  const onSubmit = async (values: PayrollFormValues) => {
    try {
      const res = await createPayroll({
        employee: values.employeeId,
        month: values.month.toISOString(),
        basicSalary: Number(values.basicSalary) || 0,
        allowances: Number(values.allowances) || 0,
        bonus: Number(values.bonus) || 0,
        overtime: Number(values.overtime) || 0,
        deductions: Number(values.deductions) || 0,
        netPay: values.netPay,
        status: values.status as any,
        paymentMode: values.paymentModeId || undefined,
        paymentDate: values.paymentDate?.toISOString(),
        notes: values.notes,
      });

      await queryClient.invalidateQueries({ queryKey: ['payrolls'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'Payroll created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not save payroll',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <PayrollForm
      headerText="Add Payroll"
      submitText="Save Payroll"
      submittingText="Saving..."
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default CreatePayroll;
