import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { useUpdateCustomer, useDeleteCustomer } from '../../api/useCustomer';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditCustomerRoute = RouteProp<RootStackParamList, 'EditCustomer'>;

const EditCustomer = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditCustomerRoute>();
  const queryClient = useQueryClient();
  const { customer } = route.params;

  const { updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const [title, setTitle] = useState(customer.title ?? '');
  const [company, setCompany] = useState(customer.company ?? '');
  const [email, setEmail] = useState(customer.email ?? '');
  const [phone, setPhone] = useState(customer.phone ?? '');
  const [line1, setLine1] = useState(customer.address?.line1 ?? '');
  const [line2, setLine2] = useState(customer.address?.line2 ?? '');
  const [city, setCity] = useState(customer.address?.city ?? '');
  const [state, setState] = useState(customer.address?.state ?? '');
  const [stateCode, setStateCode] = useState(customer.address?.stateCode ?? '');
  const [country, setCountry] = useState(customer.address?.country ?? '');
  const [countryCode, setCountryCode] = useState(customer.address?.countryCode ?? '');
  const [notes, setNotes] = useState(customer.notes ?? '');

  const onUpdate = async () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Title is required' });
      return;
    }

    try {
      const response = await updateCustomer({
        id: customer._id,
        body: {
          title,
          company: company || undefined,
          email: email || undefined,
          phone: phone || undefined,
          address: {
            line1: line1 || undefined,
            line2: line2 || undefined,
            city: city || undefined,
            state: state || undefined,
            stateCode: stateCode || undefined,
            country: country || undefined,
            countryCode: countryCode || undefined,
          },
          notes: notes || undefined,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ['customers'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Customer updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      console.log('Update customer error:', err);
      Toast.show({
        type: 'error',
        text1: 'Could not update customer',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
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
          onPress: async () => {
            try {
              const response = await deleteCustomer({ id: customer._id });

              await queryClient.invalidateQueries({ queryKey: ['customers'] });

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: response?.message || 'Customer deleted successfully',
              });

              navigation.goBack();
            } catch (err: any) {
              console.log('Delete customer error:', err);
              Toast.show({
                type: 'error',
                text1: 'Could not delete customer',
                text2: err?.message || 'Something went wrong. Please try again.',
              });
            }
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
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Ali Traders"
            placeholderTextColor={colors.gray}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Company</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Ali Traders Pvt Ltd"
            placeholderTextColor={colors.gray}
            value={company}
            onChangeText={setCompany}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. ali@traders.com"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

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

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 1</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Shop 12, Tariq Road"
            placeholderTextColor={colors.gray}
            value={line1}
            onChangeText={setLine1}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 2</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="Apartment, suite, etc. (optional)"
            placeholderTextColor={colors.gray}
            value={line2}
            onChangeText={setLine2}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Karachi"
            placeholderTextColor={colors.gray}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Sindh"
            placeholderTextColor={colors.gray}
            value={state}
            onChangeText={setState}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>State Code</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. SD"
            placeholderTextColor={colors.gray}
            value={stateCode}
            onChangeText={setStateCode}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Pakistan"
            placeholderTextColor={colors.gray}
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Country Code</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. PK"
            placeholderTextColor={colors.gray}
            value={countryCode}
            onChangeText={setCountryCode}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.inputBox, styles.textArea]}
            placeholder="Any additional notes"
            placeholderTextColor={colors.gray}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <CustomButton
          text={isUpdating ? 'Updating...' : 'Update Customer'}
          onPress={onUpdate}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
          disabled={isUpdating || isDeleting}
        />

        <CustomButton
          text={isDeleting ? 'Deleting...' : 'Delete Customer'}
          onPress={onDelete}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor="transparent"
          textColor={colors.red}
          borderColor={colors.red}
          borderWidth={1}
          borderRadius={8}
          disabled={isUpdating || isDeleting}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
    gap: height * 0.022,
  },
  field: { gap: 8 },
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