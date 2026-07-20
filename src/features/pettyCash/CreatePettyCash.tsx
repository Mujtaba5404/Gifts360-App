import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { RootState, store } from '../../redux/store'; // <-- adjust path if your store/RootState type lives elsewhere
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { formatDisplayDate } from './types';
import { useCreatePettyCash, usePettyCash } from '../../api/usePettyCash';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface DropdownOption {
  label: string;
  value: string;
}

const CreatePettyCash = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createPettyCash, isPending } = useCreatePettyCash();

  // roleSlice se logged-in user nikal rahe hain (jo signIn ke waqt setUser se store hua tha)
  const user = useSelector((state: RootState) => state.role.user); // <-- adjust 'role' key if your rootReducer names it differently
  const { data: pettyCashData, isLoading: isLoadingAccounts } = usePettyCash({
    page: 1,
    pageSize: 100,
  });

  const accountOptions: DropdownOption[] = useMemo(() => {
    const rows = pettyCashData?.data ?? [];
    const seen = new Map<string, DropdownOption>();

    rows.forEach(row => {
      if (row.account?._id && !seen.has(row.account._id)) {
        seen.set(row.account._id, {
          label: row.account.title,
          value: row.account._id,
        });
      }
    });

    return Array.from(seen.values());
  }, [pettyCashData]);

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [amount, setAmount] = useState('');

  const selectedAccountLabel =
    accountOptions.find(option => option.value === accountId)?.label ?? '';

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSelectAccount = (selected: string) => {
    setAccountId(selected);
    setShowAccountDropdown(false);
  };

  const onSave = async () => {
    const parsedAmount = Number(amount);

    if (!description.trim()) {
      Toast.show({ type: 'error', text1: 'Please add a description' });
      return;
    }
    if (!accountId) {
      Toast.show({ type: 'error', text1: 'Please select an account' });
      return;
    }
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount === 0) {
      Toast.show({ type: 'error', text1: 'Please enter a valid amount' });
      return;
    }
    if (!user?._id) {
  Toast.show({
    type: 'error',
    text1: 'Session expired, please login again',
  });
  return;
}

    try {
      const res = await createPettyCash({
        body: {
          date: date.toISOString(),
          description: description.trim(),
          account: accountId,
          amount: parsedAmount,
          user: user._id, // <-- required by backend
        },
      });

      // List ko dobara fetch karwao taake nayi entry turant dikhe.
      await queryClient.invalidateQueries({ queryKey: ['petty-cash'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'Petty cash entry created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not save petty cash',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Add Petty Cash" isBack />

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

        {/* Account - dropdown, real picklist _id use karta hai */}
        <View style={styles.field}>
          <Text style={styles.label}>Account</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setShowAccountDropdown(true)}
          >
            <Text
              style={[
                styles.input,
                styles.flex1,
                !selectedAccountLabel && styles.placeholderText,
              ]}
            >
              {selectedAccountLabel || 'Select account'}
            </Text>
            {isLoadingAccounts ? (
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
          text={isPending ? 'Saving...' : 'Save Petty Cash'}
          onPress={onSave}
          disabled={isPending}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />
      </KeyboardAwareScrollView>

      <Modal
        visible={showAccountDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAccountDropdown(false)}
        >
          <ScrollView
            style={styles.dropdownBox}
            contentContainerStyle={styles.dropdownContent}
            keyboardShouldPersistTaps="handled"
          >
            {accountOptions.length === 0 ? (
              <Text style={styles.dropdownEmptyText}>
                No accounts available.
              </Text>
            ) : (
              accountOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => onSelectAccount(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      option.value === accountId &&
                        styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === accountId && (
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

export default CreatePettyCash;