import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { useCreateVendor, Address } from '../../api/useVendor';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CreateVendor = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createVendor, isPending } = useCreateVendor();

  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [type, setType] = useState('');
  const [vendorPercentage, setVendorPercentage] = useState('');
  const [categories, setCategories] = useState('');
  const [services, setServices] = useState('');

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const buildAddress = (): Address | undefined => {
    const address = {
      line1,
      line2,
      city,
      state: stateVal,
      stateCode,
      country,
      countryCode,
    };
    const hasValue = Object.values(address).some(v => v.trim() !== '');
    return hasValue ? address : undefined;
  };

  const toIdArray = (value: string) =>
    value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

  const onSave = async () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Title is required' });
      return;
    }

    if (vendorPercentage.trim()) {
      const num = Number(vendorPercentage);
      if (Number.isNaN(num) || num < 0 || num > 100) {
        Toast.show({
          type: 'error',
          text1: 'Invalid vendor percentage',
          text2: 'Must be a number between 0 and 100.',
        });
        return;
      }
    }

    try {
      const response = await createVendor({
        body: {
          title: title.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          secondaryPhone: secondaryPhone.trim() || undefined,
          address: buildAddress(),
          type: type.trim() || undefined,
          vendorPercentage: vendorPercentage.trim()
            ? Number(vendorPercentage)
            : undefined,
          categories: categories.trim() ? toIdArray(categories) : undefined,
          services: services.trim() ? toIdArray(services) : undefined,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ['vendor'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Vendor created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      console.log('Create vendor error:', err);
      Toast.show({
        type: 'error',
        text1: 'Could not create vendor',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Add Vendor" isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. K-Electric"
            placeholderTextColor={colors.gray}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. vendor@example.com"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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

        {/* Secondary Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>Secondary Phone</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. 0311-7654321"
            placeholderTextColor={colors.gray}
            value={secondaryPhone}
            onChangeText={setSecondaryPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="Vendor type ID"
            placeholderTextColor={colors.gray}
            value={type}
            onChangeText={setType}
          />
        </View>

        {/* Vendor Percentage */}
        <View style={styles.field}>
          <Text style={styles.label}>Vendor Percentage</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. 10"
            placeholderTextColor={colors.gray}
            value={vendorPercentage}
            onChangeText={setVendorPercentage}
            keyboardType="numeric"
          />
        </View>

        {/* Categories */}
        <View style={styles.field}>
          <Text style={styles.label}>Categories</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="Comma separated category IDs"
            placeholderTextColor={colors.gray}
            value={categories}
            onChangeText={setCategories}
            autoCapitalize="none"
          />
        </View>

        {/* Services */}
        <View style={styles.field}>
          <Text style={styles.label}>Services</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="Comma separated service IDs"
            placeholderTextColor={colors.gray}
            value={services}
            onChangeText={setServices}
            autoCapitalize="none"
          />
        </View>

        {/* Address */}
        <Text style={styles.sectionTitle}>Address</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 1</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Elander Road"
            placeholderTextColor={colors.gray}
            value={line1}
            onChangeText={setLine1}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 2</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="Apartment, suite, etc."
            placeholderTextColor={colors.gray}
            value={line2}
            onChangeText={setLine2}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[styles.input, styles.inputBox]}
              placeholder="e.g. Karachi"
              placeholderTextColor={colors.gray}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={[styles.input, styles.inputBox]}
              placeholder="e.g. Sindh"
              placeholderTextColor={colors.gray}
              value={stateVal}
              onChangeText={setStateVal}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>State Code</Text>
            <TextInput
              style={[styles.input, styles.inputBox]}
              placeholder="e.g. SD"
              placeholderTextColor={colors.gray}
              value={stateCode}
              onChangeText={t => setStateCode(t.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>Country Code</Text>
            <TextInput
              style={[styles.input, styles.inputBox]}
              placeholder="e.g. PK"
              placeholderTextColor={colors.gray}
              value={countryCode}
              onChangeText={t => setCountryCode(t.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>
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

        <CustomButton
          text={isPending ? 'Saving...' : 'Save Vendor'}
          onPress={onSave}
          disabled={isPending}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
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
  row: { flexDirection: 'row', gap: width * 0.03 },
  flex1: { flex: 1 },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  sectionTitle: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
    marginTop: height * 0.01,
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
});

export default CreateVendor;
