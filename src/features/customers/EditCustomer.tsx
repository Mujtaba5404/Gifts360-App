import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditCustomerRouteProp = RouteProp<RootStackParamList, 'EditCustomer'>;

const EditCustomer = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditCustomerRouteProp>();
  const { customer: incomingCustomer } = route.params;

  const [name, setName] = useState(incomingCustomer.name ?? '');
  const [phone, setPhone] = useState(incomingCustomer.phone ?? '');
  const [address, setAddress] = useState(incomingCustomer.address ?? '');

  const onUpdate = () => {
    const updatedCustomer = {
      ...incomingCustomer,
      name,
      phone,
      address,
    };
    console.log('Updated customer:', updatedCustomer);

    navigation.goBack();
  };

  const onDelete = () => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer?',
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
      <TopHeader text="Edit Customer" isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
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

        {/* Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. 0300-1234567"
            placeholderTextColor={colors.gray}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address */}
        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.inputBox, styles.textArea]}
            placeholder="e.g. Shop 12, Tariq Road, Karachi"
            placeholderTextColor={colors.gray}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        <CustomButton
          text="Update Customer"
          onPress={onUpdate}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />

        <CustomButton
          text="Delete Customer"
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
  textArea: {
    minHeight: height * 0.1,
    textAlignVertical: 'top',
  },
});

export default EditCustomer;
