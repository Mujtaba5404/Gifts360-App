import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  Alert,
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
import {
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from '../../api/useExpenses';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import {
  CASH_PAYMENT_MODE,
  getPaymentModeLabel,
  PAYMENT_MODES,
} from './paymentModes';
import { getCategoryOptions, getTypeOptions } from './picklistOptions';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditExpenseRouteProp = RouteProp<RootStackParamList, 'EditExpenses'>;

/** Ek waqt mein sirf ek dropdown khula rehta hai. */
type OpenDropdown = 'paymentMode' | 'type' | 'category' | null;

interface DropdownOption {
  label: string;
  value: string;
}

const formatDisplayDate = (d: Date) =>
  d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const parseIncomingDate = (dateStr: string) => {
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const EditExpenses = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditExpenseRouteProp>();
  const queryClient = useQueryClient();
  const { expense: incomingExpense } = route.params;

  const { updateExpense, isPending: isUpdating } = useUpdateExpense();
  const { deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const isBusy = isUpdating || isDeleting;

  // Expense/Category ke options mojooda expenses se aate hain (koi picklist API nahi hai).
  const { data: expensesData, isLoading: isLoadingOptions } = useExpenses({
    page: 1,
    pageSize: 100,
  });

  const [date, setDate] = useState<Date>(parseIncomingDate(incomingExpense.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [payee, setPayee] = useState(incomingExpense.payee ?? '');
  const [paymentMode, setPaymentMode] = useState(
    incomingExpense.paymentMode ?? CASH_PAYMENT_MODE,
  );
  const [paymentReference, setPaymentReference] = useState(
    incomingExpense.paymentReference ?? '',
  );
  const [description, setDescription] = useState(incomingExpense.description ?? '');
  const [typeId, setTypeId] = useState(incomingExpense.type?._id ?? '');
  const [categoryId, setCategoryId] = useState(incomingExpense.category?._id ?? '');
  const [amount, setAmount] = useState(incomingExpense.amount?.toString() ?? '');
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const expenses = useMemo(() => expensesData?.data ?? [], [expensesData]);

  const typeOptions: DropdownOption[] = useMemo(
    () => getTypeOptions(expenses),
    [expenses],
  );

  // Categories apne parent type ke neeche aati hain, is liye chuni hui type par filter.
  const categoryOptions: DropdownOption[] = useMemo(
    () => getCategoryOptions(expenses, typeId),
    [expenses, typeId],
  );

  const labelFor = (options: DropdownOption[], value: string) =>
    options.find(option => option.value === value)?.label ?? '';

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSelectPaymentMode = (mode: string) => {
    setPaymentMode(mode);
    setOpenDropdown(null);
    if (mode === CASH_PAYMENT_MODE) {
      setPaymentReference('');
    }
  };

  const onSelectType = (selectedTypeId: string) => {
    setTypeId(selectedTypeId);
    setOpenDropdown(null);
    // Purani category naye type ke under nahi hogi, is liye reset.
    setCategoryId('');
  };

  const onSelectCategory = (selectedCategoryId: string) => {
    setCategoryId(selectedCategoryId);
    setOpenDropdown(null);
  };

  const onUpdate = async () => {
    const parsedAmount = Number(amount);

    if (!payee.trim()) {
      Toast.show({ type: 'error', text1: 'Payee is required' });
      return;
    }

    if (!typeId) {
      Toast.show({ type: 'error', text1: 'Select an expense type' });
      return;
    }

    if (!categoryId) {
      Toast.show({ type: 'error', text1: 'Select a category' });
      return;
    }

    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Toast.show({ type: 'error', text1: 'Enter a valid amount' });
      return;
    }

    try {
      const response = await updateExpense({
        id: incomingExpense._id,
        body: {
          date: date.toISOString(),
          payee: payee.trim(),
          paymentMode,
          ...(paymentMode !== CASH_PAYMENT_MODE && {
            paymentReference: paymentReference.trim(),
          }),
          description: description.trim(),
          type: typeId,
          category: categoryId,
          amount: parsedAmount,
        },
      });

      // List ko dobara fetch karwao taake updated expense turant dikhe.
      await queryClient.invalidateQueries({ queryKey: ['expenses'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Expense updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not update expense',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  const onDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await deleteExpense({ id: incomingExpense._id });

            await queryClient.invalidateQueries({ queryKey: ['expenses'] });

            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: response?.message || 'Expense deleted successfully',
            });

            navigation.goBack();
          } catch (err: any) {
            Toast.show({
              type: 'error',
              text1: 'Could not delete expense',
              text2: err?.message || 'Something went wrong. Please try again.',
            });
          }
        },
      },
    ]);
  };

  const dropdownConfig: Record<
    Exclude<OpenDropdown, null>,
    { options: DropdownOption[]; selected: string; onSelect: (v: string) => void }
  > = {
    paymentMode: {
      options: PAYMENT_MODES,
      selected: paymentMode,
      onSelect: onSelectPaymentMode,
    },
    type: {
      options: typeOptions,
      selected: typeId,
      onSelect: onSelectType,
    },
    category: {
      options: categoryOptions,
      selected: categoryId,
      onSelect: onSelectCategory,
    },
  };

  const activeDropdown = openDropdown ? dropdownConfig[openDropdown] : null;

  const renderDropdownField = (
    label: string,
    placeholder: string,
    displayValue: string,
    dropdown: Exclude<OpenDropdown, null>,
    disabled?: boolean,
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputRow, disabled && styles.disabledRow]}
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => setOpenDropdown(dropdown)}
      >
        <Text
          style={[
            styles.input,
            styles.flex1,
            !displayValue && styles.placeholderText,
          ]}
        >
          {displayValue || placeholder}
        </Text>
        {isLoadingOptions && dropdown !== 'paymentMode' ? (
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
  );

  return (
    <View style={styles.container}>
      <TopHeader text="Edit Expense" isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
        {/* Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.input}>{formatDisplayDate(date)}</Text>
            <Ionicons
              name="calendar-outline"
              size={width * 0.05}
              color={colors.gray}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Payee */}
        <View style={styles.field}>
          <Text style={styles.label}>Payee</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Ali Traders"
            placeholderTextColor={colors.gray}
            value={payee}
            onChangeText={setPayee}
          />
        </View>

        {/* Payment mode */}
        {renderDropdownField(
          'Payment mode',
          'Select payment mode',
          getPaymentModeLabel(paymentMode),
          'paymentMode',
        )}

        {/* Payment reference - sirf Cash na ho tab dikhega */}
        {paymentMode !== CASH_PAYMENT_MODE && (
          <View style={styles.field}>
            <Text style={styles.label}>Reference No.</Text>
            <TextInput
              style={[styles.input, styles.inputBox]}
              placeholder={
                paymentMode === 'credit card'
                  ? 'e.g. 4242XXXXXXXX'
                  : 'e.g. Cheque / Ref No.'
              }
              placeholderTextColor={colors.gray}
              value={paymentReference}
              onChangeText={setPaymentReference}
            />
          </View>
        )}

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputBox, styles.textArea]}
            placeholder="e.g. Office supplies"
            placeholderTextColor={colors.gray}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Expense type - picklist */}
        {renderDropdownField(
          'Expense',
          isLoadingOptions ? 'Loading...' : 'Select expense type',
          labelFor(typeOptions, typeId),
          'type',
        )}

        {/* Category - picklist, chuni hui type ke under */}
        {renderDropdownField(
          'Category',
          typeId ? 'Select category' : 'Select an expense type first',
          labelFor(categoryOptions, categoryId),
          'category',
          !typeId,
        )}

        {/* Amount */}
        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>Rs</Text>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="0"
              placeholderTextColor={colors.gray}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        <CustomButton
          text={isUpdating ? 'Updating...' : 'Update Expense'}
          onPress={onUpdate}
          disabled={isBusy}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />

        <CustomButton
          text={isDeleting ? 'Deleting...' : 'Delete Expense'}
          onPress={onDelete}
          disabled={isBusy}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor="transparent"
          textColor={colors.red}
          borderColor={colors.red}
          borderWidth={1}
          borderRadius={8}
        />
      </KeyboardAwareScrollView>

      <Modal
        visible={activeDropdown !== null}
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
            {activeDropdown?.options.length === 0 ? (
              <Text style={styles.dropdownEmptyText}>No options available.</Text>
            ) : (
              activeDropdown?.options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => activeDropdown.onSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      option.value === activeDropdown.selected &&
                        styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === activeDropdown.selected && (
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
  disabledRow: {
    opacity: 0.6,
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

export default EditExpenses;
