import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, CustomTextInput } from '../../components';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { DropdownOption } from '../orders/types';
import { Checkbox, Dropdown, Field } from './formControls';

export interface UserFormValues {
  name: string;
  email: string;
  /** Edit mode mein khali chhoda ja sakta hai — matlab password badla nahi. */
  password: string;
  brands: string[];
  usesBrandAliases: boolean;
  roleId: string;
  isActive: boolean;
}

interface UserFormProps {
  submitLabel: string;
  submittingLabel?: string;

  roleOptions: DropdownOption[];
  brandOptions: string[];
  isLoadingOptions?: boolean;

  /** Edit mode mein record load hone ke baad pre-fill ke liye. */
  initialValues?: Partial<UserFormValues>;
  isLoadingInitial?: boolean;
  hasLoadError?: boolean;
  loadErrorText?: string;

  /** Create par password lazmi hai, edit par optional. */
  requirePassword?: boolean;
  isPending?: boolean;
  onSubmit: (values: UserFormValues) => void;
}

const MIN_PASSWORD_LENGTH = 6;

const UserForm = ({
  submitLabel,
  submittingLabel = 'Saving...',
  roleOptions,
  brandOptions,
  isLoadingOptions = false,
  initialValues,
  isLoadingInitial = false,
  hasLoadError = false,
  loadErrorText = 'Could not load this user.',
  requirePassword = true,
  isPending = false,
  onSubmit,
}: UserFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [usesBrandAliases, setUsesBrandAliases] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (!initialValues || isPrefilled) return;

    setName(initialValues.name ?? '');
    setEmail(initialValues.email ?? '');
    setBrands(initialValues.brands ?? []);
    setUsesBrandAliases(!!initialValues.usesBrandAliases);
    setRoleId(initialValues.roleId ?? '');
    setIsActive(initialValues.isActive ?? true);

    setIsPrefilled(true);
  }, [initialValues, isPrefilled]);

  const selectedRoleLabel =
    roleOptions.find(option => option.value === roleId)?.label ?? '';

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      return setError('Name is required.');
    }
    if (!trimmedEmail.includes('@')) {
      return setError('A valid email is required.');
    }
    if (requirePassword || password.length > 0) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return setError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        );
      }
    }
    if (brands.length === 0) {
      return setError('Please select at least one brand.');
    }
    if (!roleId) {
      return setError('Please select a role.');
    }

    setError('');
    onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      password,
      brands,
      usesBrandAliases,
      roleId,
      isActive,
    });
  };

  if (isLoadingInitial) {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={colors.mantineBlue} />
      </View>
    );
  }

  if (hasLoadError) {
    return (
      <View style={styles.centerFill}>
        <Text style={styles.loadErrorText}>{loadErrorText}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Name" required>
          <CustomTextInput
            placeholder="Enter name"
            placeholderTextColor={colors.gray}
            inputHeight={height * 0.06}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Email" required>
          <CustomTextInput
            placeholder="Enter email"
            placeholderTextColor={colors.gray}
            inputHeight={height * 0.06}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>

        <Field label="Password" required={requirePassword}>
          <CustomTextInput
            placeholder={
              requirePassword ? 'Enter password' : 'Leave blank to keep current'
            }
            placeholderTextColor={colors.gray}
            inputHeight={height * 0.06}
            isPassword
            value={password}
            onChangeText={setPassword}
          />
        </Field>

        <Field label="Role" required>
          <Dropdown
            placeholder={isLoadingOptions ? 'Loading roles...' : 'Select role'}
            options={roleOptions.map(option => option.label)}
            selected={selectedRoleLabel ? [selectedRoleLabel] : []}
            onChange={values => {
              const label = values[0];
              const match = roleOptions.find(option => option.label === label);
              setRoleId(match?.value ?? '');
            }}
          />
        </Field>

        <View style={styles.switchRow}>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ true: colors.mantineBlue, false: colors.lightGray }}
            thumbColor={colors.white}
          />
          <Text style={styles.switchLabel}>Is Active</Text>
        </View>

        {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

        <CustomButton
          text={isPending ? submittingLabel : submitLabel}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={12}
          disabled={isPending}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,
  },
  loadErrorText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.05,
    gap: height * 0.02,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  switchLabel: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
  },
});

export default UserForm;
