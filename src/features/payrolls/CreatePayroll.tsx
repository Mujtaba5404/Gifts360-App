// CreatePayroll.tsx
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
        salary: Number(values.salary) || 0,
        arrears: Number(values.arrears) || 0,
        deduction: Number(values.deduction) || 0,
        tax: Number(values.tax) || 0,
        netSalary: values.netSalary,
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