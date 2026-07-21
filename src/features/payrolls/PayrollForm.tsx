// PayrollForm.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { usePayrolls } from '../../api/usePayrolls';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import formatAmount from '../../utils/formatAmount';
import { fontSizes } from '../../utils/fontSizes';
import { calculateNetSalary, formatMonth, getEmployeeOptions } from './options';

type OpenDropdown = 'employee' | null;
type OpenDatePicker = 'month' | null;

export interface PayrollFormValues {
  employeeId: string;
  month: Date;
  salary: string;
  arrears: string;
  deduction: string;
  tax: string;
  netSalary: number;
  notes: string;
}

export interface PayrollFormProps {
  headerText: string;
  submitText: string;
  submittingText: string;
  initialValues?: Partial<PayrollFormValues>;
  isLoadingInitial?: boolean;
  hasLoadError?: boolean;
  loadErrorText?: string;

  isPending: boolean;
  onSubmit: (values: PayrollFormValues) => Promise<void> | void;
}

const toNumber = (value: string) => {
  const parsed = Number(value.trim());
  return isNaN(parsed) ? 0 : parsed;
};

const PayrollForm: React.FC<PayrollFormProps> = ({
  headerText,
  submitText,
  submittingText,
  initialValues,
  isLoadingInitial = false,
  hasLoadError = false,
  loadErrorText = 'Could not load this payroll.',
  isPending,
  onSubmit,
}) => {
  // Employee ke options mojooda payrolls se aate hain.
  const { data: payrollsData, isLoading: isLoadingOptions } = usePayrolls({
    page: 1,
    pageSize: 100,
  });
  const payrolls = useMemo(() => payrollsData?.data ?? [], [payrollsData]);

  const employeeOptions = useMemo(
    () => getEmployeeOptions(payrolls),
    [payrolls],
  );

  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState<Date>(new Date());
  const [salary, setSalary] = useState('');
  const [arrears, setArrears] = useState('');
  const [deduction, setDeduction] = useState('');
  const [tax, setTax] = useState('');
  const [notes, setNotes] = useState('');

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [datePickerFor, setDatePickerFor] = useState<OpenDatePicker>(null);

  // Edit mode: record aane ke baad form ko ek dafa pre-fill karna hai.
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (!initialValues || isPrefilled) return;

    setEmployeeId(initialValues.employeeId ?? '');
    setMonth(initialValues.month ?? new Date());
    setSalary(initialValues.salary ?? '');
    setArrears(initialValues.arrears ?? '');
    setDeduction(initialValues.deduction ?? '');
    setTax(initialValues.tax ?? '');
    setNotes(initialValues.notes ?? '');

    setIsPrefilled(true);
  }, [initialValues, isPrefilled]);

  // Net salary derived hai — user isse type nahi karta.
  const netSalary = useMemo(
    () =>
      calculateNetSalary({
        salary: toNumber(salary),
        arrears: toNumber(arrears),
        deduction: toNumber(deduction),
        tax: toNumber(tax),
      }),
    [salary, arrears, deduction, tax],
  );

  const selectedEmployeeLabel =
    employeeOptions.find(option => option.value === employeeId)?.label ?? '';

  const onSelectDropdown = (value: string) => {
    if (openDropdown === 'employee') setEmployeeId(value);
    setOpenDropdown(null);
  };

  const onDateChange = (_event: any, selected?: Date) => {
    setDatePickerFor(Platform.OS === 'ios' ? 'month' : null);
    if (!selected) return;
    setMonth(selected);
  };

  const handleSubmit = () => {
    if (!employeeId) {
      Toast.show({ type: 'error', text1: 'Please select an employee' });
      return;
    }
    if (!salary.trim() || toNumber(salary) <= 0) {
      Toast.show({ type: 'error', text1: 'Please enter a valid salary' });
      return;
    }
    if (netSalary <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Net salary must be greater than 0',
        text2: 'Check salary, arrears, deduction and tax values.',
      });
      return;
    }

    onSubmit({
      employeeId,
      month,
      salary,
      arrears,
      deduction,
      tax,
      netSalary,
      notes: notes.trim(),
    });
  };

  // Edit mode: jab tak record load ho raha hai, form ke bajaye loader dikhao.
  if (isLoadingInitial) {
    return (
      <View style={styles.container}>
        <TopHeader text={headerText} isBack />
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      </View>
    );
  }

  if (hasLoadError) {
    return (
      <View style={styles.container}>
        <TopHeader text={headerText} isBack />
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{loadErrorText}</Text>
        </View>
      </View>
    );
  }

  const renderAmountField = (
    label: string,
    value: string,
    setValue: (next: string) => void,
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Text style={styles.currencyPrefix}>Rs</Text>
        <TextInput
          style={[styles.input, styles.flex1]}
          placeholder="0"
          placeholderTextColor={colors.gray}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopHeader text={headerText} isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
        {/* Employee */}
        <View style={styles.field}>
          <Text style={styles.label}>Employee</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setOpenDropdown('employee')}
          >
            <Text
              style={[
                styles.input,
                styles.flex1,
                !selectedEmployeeLabel && styles.placeholderText,
              ]}
            >
              {selectedEmployeeLabel || 'Select employee'}
            </Text>
            {isLoadingOptions ? (
              <ActivityIndicator size="small" color={colors.gray} />
            ) : (
              <Ionicons
                name="chevron-down"
                size={width * 0.05}
                color={colors.gray}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Month */}
        <View style={styles.field}>
          <Text style={styles.label}>Month</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setDatePickerFor('month')}
          >
            <Text style={[styles.input, styles.flex1]}>
              {formatMonth(month)}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={width * 0.05}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        {renderAmountField('Salary', salary, setSalary)}
        {renderAmountField('Arrears', arrears, setArrears)}
        {renderAmountField('Deduction', deduction, setDeduction)}
        {renderAmountField('Tax', tax, setTax)}

        {/* Net salary — derived, is liye read-only summary row hai. */}
        <View style={styles.netPayRow}>
          <Text style={styles.netPayLabel}>Net Salary</Text>
          <Text style={styles.netPayValue}>{formatAmount(netSalary)}</Text>
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.inputBox, styles.textArea]}
            placeholder="Optional notes"
            placeholderTextColor={colors.gray}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <CustomButton
          text={isPending ? submittingText : submitText}
          onPress={handleSubmit}
          disabled={isPending}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />
      </KeyboardAwareScrollView>

      {datePickerFor && (
        <DateTimePicker
          value={month}
          mode="date"
          maximumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      <Modal
        visible={openDropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenDropdown(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpenDropdown(null)}
        >
          <ScrollView
            style={styles.dropdownBox}
            contentContainerStyle={styles.dropdownContent}
            keyboardShouldPersistTaps="handled"
          >
            {employeeOptions.length === 0 ? (
              <Text style={styles.dropdownEmptyText}>
                No options available yet.
              </Text>
            ) : (
              employeeOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => onSelectDropdown(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      option.value === employeeId &&
                        styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === employeeId && (
                    <Ionicons
                      name="checkmark"
                      size={width * 0.05}
                      color={colors.mantineBlue}
                    />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: height * 0.02,
    paddingHorizontal: width * 0.1,
  },
  errorText: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
    gap: height * 0.022,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  input: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
    padding: 0,
  },
  placeholderText: {
    color: colors.gray,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.016,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: width * 0.02,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.016,
  },
  flex1: {
    flex: 1,
  },
  textArea: {
    minHeight: height * 0.1,
    textAlignVertical: 'top',
  },
  currencyPrefix: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.gray,
  },
  netPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.018,
  },
  netPayLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  netPayValue: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.mantineBlue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
  },
  dropdownBox: {
    flexGrow: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: height * 0.5,
  },
  dropdownContent: {
    paddingVertical: height * 0.01,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
  },
  dropdownOptionText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  dropdownOptionTextSelected: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  dropdownEmptyText: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default PayrollForm;