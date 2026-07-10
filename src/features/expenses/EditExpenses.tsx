import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditExpenseRouteProp = RouteProp<RootStackParamList, 'EditExpenses'>;

const PAYMENT_MODES = ['Cash', 'Card', 'Bank Transfer'];

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
  const { expense: incomingExpense } = route.params;

  const [date, setDate] = useState<Date>(parseIncomingDate(incomingExpense.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [payee, setPayee] = useState(incomingExpense.payee ?? '');
  const [paymentMode, setPaymentMode] = useState(incomingExpense.paymentMode ?? 'Cash');
  const [showPaymentModeDropdown, setShowPaymentModeDropdown] = useState(false);
  const [paymentReference, setPaymentReference] = useState(
    incomingExpense.paymentReference ?? '',
  );
  const [description, setDescription] = useState(incomingExpense.description ?? '');
  const [expense, setExpense] = useState(incomingExpense.expense ?? '');
  const [category, setCategory] = useState(incomingExpense.category ?? '');
  const [amount, setAmount] = useState(incomingExpense.amount?.toString() ?? '');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSelectPaymentMode = (mode: string) => {
    setPaymentMode(mode);
    setShowPaymentModeDropdown(false);
    if (mode === 'Cash') {
      setPaymentReference('');
    }
  };

  const onUpdate = () => {
    const updatedExpense = {
      ...incomingExpense,
      date: date.toISOString(),
      payee,
      paymentMode,
      paymentReference: paymentMode === 'Cash' ? undefined : paymentReference,
      description,
      expense,
      category,
      amount,
    };

    navigation.goBack();
  };

  const onDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    );
  };

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
            <Ionicons name="calendar-outline" size={width * 0.05} color={colors.gray} />
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

        {/* Payment mode - dropdown */}
        <View style={styles.field}>
          <Text style={styles.label}>Payment mode</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setShowPaymentModeDropdown(true)}
          >
            <Text style={[styles.input, styles.flex1]}>{paymentMode}</Text>
            <Ionicons name="chevron-down" size={width * 0.05} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {paymentMode !== 'Cash' && (
          <View style={styles.field}>
            <Text style={styles.label}>Reference No.</Text>
            <TextInput
              style={[styles.input, styles.inputBox]}
              placeholder={
                paymentMode === 'Card' ? 'e.g. 4242XXXXXXXX' : 'e.g. Cheque / Ref No.'
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

        {/* Expense */}
        <View style={styles.field}>
          <Text style={styles.label}>Expense</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Stationery"
            placeholderTextColor={colors.gray}
            value={expense}
            onChangeText={setExpense}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Office supplies category"
            placeholderTextColor={colors.gray}
            value={category}
            onChangeText={setCategory}
          />
        </View>

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
          text="Update Expense"
          onPress={onUpdate}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />

        <CustomButton
          text="Delete Expense"
          onPress={onDelete}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor="transparent"
          textColor={colors.mantineBlue}
          borderColor={colors.mantineBlue}
          borderWidth={1}
          borderRadius={8}
        />
      </KeyboardAwareScrollView>

      <Modal
        visible={showPaymentModeDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPaymentModeDropdown(false)}
        >
          <View style={styles.dropdownBox}>
            {PAYMENT_MODES.map(mode => (
              <TouchableOpacity
                key={mode}
                style={styles.dropdownOption}
                onPress={() => onSelectPaymentMode(mode)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    mode === paymentMode && styles.dropdownOptionTextSelected,
                  ]}
                >
                  {mode}
                </Text>
                {mode === paymentMode && (
                  <Ionicons name="checkmark" size={width * 0.05} color={colors.mantineBlue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
  },
  dropdownBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: height * 0.01,
    borderWidth: 1,
    borderColor: colors.border,
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
});

export default EditExpenses;