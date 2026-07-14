import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
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
import { ACCOUNTS, formatDisplayDate } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CreatePettyCash = () => {
  const navigation = useNavigation<Nav>();

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [account, setAccount] = useState('Cash');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [amount, setAmount] = useState('');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSelectAccount = (selected: string) => {
    setAccount(selected);
    setShowAccountDropdown(false);
  };

  const onSave = () => {
    const newEntry = {
      id: Date.now().toString(),
      date: date.toISOString(),
      name,
      description,
      account,
      amount: Number(amount) || 0,
    };
    console.log('New petty cash:', newEntry);

    navigation.goBack();
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

        {/* Account - dropdown */}
        <View style={styles.field}>
          <Text style={styles.label}>Account</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setShowAccountDropdown(true)}
          >
            <Text style={[styles.input, styles.flex1]}>{account}</Text>
            <Ionicons
              name="chevron-down"
              size={width * 0.05}
              color={colors.gray}
            />
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
          text="Save Petty Cash"
          onPress={onSave}
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
          <View style={styles.dropdownBox}>
            {ACCOUNTS.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => onSelectAccount(option)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    option === account && styles.dropdownOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {option === account && (
                  <Ionicons
                    name="checkmark"
                    size={width * 0.05}
                    color={colors.mantineBlue}
                  />
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

export default CreatePettyCash;
