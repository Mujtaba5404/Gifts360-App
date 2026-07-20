import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
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
import { formatDisplayDate, parseIncomingDate } from './types';
import { usePettyCash, useUpdatePettyCash } from '../../api/usePettyCash';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditPettyCashRouteProp = RouteProp<RootStackParamList, 'EditPettyCash'>;

const EditPettyCash = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditPettyCashRouteProp>();
  const { entry: incomingEntry } = route.params;
  const queryClient = useQueryClient();

  const [date, setDate] = useState<Date>(parseIncomingDate(incomingEntry.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  // API par entry ka naam `user` object ke andar aata hai (top level par nahi).
  const [name, setName] = useState(incomingEntry.user?.name ?? '');
  const [description, setDescription] = useState(incomingEntry.description ?? '');

  // account now stores just the id — the object is only used for display
  const [account, setAccount] = useState<string>(incomingEntry.account?._id ?? '');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [amount, setAmount] = useState(incomingEntry.amount?.toString() ?? '');

  const { updatePettyCash, isPending } = useUpdatePettyCash();

  // Pull account options from existing petty cash entries (dedup by _id)
  const { data: pettyCashData } = usePettyCash({ page: 1, pageSize: 100 });

  const accountOptions =
    pettyCashData?.data
      ?.map(item => item.account)
      ?.filter((item, index, self) => index === self.findIndex(x => x._id === item._id)) ?? [];

  const selectedAccountTitle =
    accountOptions.find(a => a._id === account)?.title ?? incomingEntry.account?.title ?? '';

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSelectAccount = (selectedId: string) => {
    setAccount(selectedId);
    setShowAccountDropdown(false);
  };

  const onUpdate = async () => {
    try {
      const res = await updatePettyCash({
        id: incomingEntry._id,
        body: {
          date: date.toISOString(),
          description: description.trim(),
          account,
          amount: Number(amount) || 0,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ['petty-cash'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Petty Cash updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err?.message ?? 'Something went wrong',
      });
    }
  };

  const onDelete = () => {
    Alert.alert(
      'Delete Petty Cash',
      'Are you sure you want to delete this petty cash entry?',
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
      <TopHeader text="Edit Petty Cash" isBack />

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

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Ali Traders"
            placeholderTextColor={colors.gray}
            value={name}
            onChangeText={setName}
          />
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

        {/* Account - dropdown, fetched dynamically */}
        <View style={styles.field}>
          <Text style={styles.label}>Account</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setShowAccountDropdown(true)}
          >
            <Text style={[styles.input, styles.flex1]}>{selectedAccountTitle}</Text>
            <Ionicons name="chevron-down" size={width * 0.05} color={colors.gray} />
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

        {/* Balance - running balance, derived from the entries before this one */}
        <View style={styles.field}>
          <Text style={styles.label}>Balance</Text>
          <View style={[styles.inputRow, styles.readOnlyRow]}>
            <Text style={styles.currencyPrefix}>Rs</Text>
            <Text style={[styles.input, styles.flex1, styles.readOnlyText]}>
              {incomingEntry.balance.toLocaleString()}
            </Text>
          </View>
        </View>

        <CustomButton
          text={isPending ? 'Updating...' : 'Update Petty Cash'}
          onPress={onUpdate}
          disabled={isPending}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />

        <CustomButton
          text="Delete Petty Cash"
          onPress={onDelete}
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
          <View style={styles.dropdownBox}>
            {accountOptions.map(option => (
              <TouchableOpacity
                key={option._id}
                style={styles.dropdownOption}
                onPress={() => onSelectAccount(option._id)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    option._id === account && styles.dropdownOptionTextSelected,
                  ]}
                >
                  {option.title}
                </Text>
                {option._id === account && (
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
  readOnlyRow: {
    opacity: 0.7,
  },
  readOnlyText: {
    color: colors.gray,
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

export default EditPettyCash;