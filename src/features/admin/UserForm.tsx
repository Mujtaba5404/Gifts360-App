import { useState } from 'react';
import {
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
import { Checkbox, Dropdown, Field } from './formControls';

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  brands: string[];
  usesBrandAliases: boolean;
  role: string;
  isActive: boolean;
}

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  submitLabel: string;
  onSubmit: (values: UserFormValues) => void;
}

// Placeholder option sets (replace with real data when the backend is wired).
const BRAND_OPTIONS = ['Gifts360', 'Nike', 'Adidas', 'Zara', 'Puma'];
const ROLE_OPTIONS = ['Admin', 'Manager', 'Editor', 'Viewer'];
const MIN_PASSWORD_LENGTH = 6;

const UserForm = ({ initialValues, submitLabel, onSubmit }: UserFormProps) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState(initialValues?.password ?? '');
  const [brands, setBrands] = useState<string[]>(initialValues?.brands ?? []);
  const [usesBrandAliases, setUsesBrandAliases] = useState(
    initialValues?.usesBrandAliases ?? false,
  );
  const [role, setRole] = useState(initialValues?.role ?? '');
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      return setError('Name is required.');
    }
    if (!trimmedEmail.includes('@')) {
      return setError('A valid email is required.');
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
    }
    if (brands.length === 0) {
      return setError('Please select at least one brand.');
    }
    if (!role) {
      return setError('Please select a role.');
    }

    onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      password,
      brands,
      usesBrandAliases,
      role,
      isActive,
    });
  };

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

        <Field label="Password" required>
          <CustomTextInput
            placeholder="Enter password"
            placeholderTextColor={colors.gray}
            inputHeight={height * 0.06}
            isPassword
            value={password}
            onChangeText={setPassword}
          />
        </Field>

        <Field label="Brands" required>
          <Dropdown
            placeholder="Select brands"
            options={BRAND_OPTIONS}
            selected={brands}
            multiple
            onChange={setBrands}
          />
        </Field>

        <Checkbox
          label="Uses Brand Aliases"
          checked={usesBrandAliases}
          onToggle={() => setUsesBrandAliases(prev => !prev)}
        />

        <Field label="Role" required>
          <Dropdown
            placeholder="Select role"
            options={ROLE_OPTIONS}
            selected={role ? [role] : []}
            onChange={values => setRole(values[0] ?? '')}
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
          text={submitLabel}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={12}
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
