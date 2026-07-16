import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, CustomTextInput, TopHeader } from '../../components';
import { useChangePassword } from '../../api/useChangePassword';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MIN_PASSWORD_LENGTH = 8;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<Nav>();
  const { changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Toast.show({ type: 'error', text1: 'Enter your current password' });
      return;
    }
    if (!newPassword.trim()) {
      Toast.show({ type: 'error', text1: 'Enter a new password' });
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      Toast.show({
        type: 'error',
        text1: `New password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
      return;
    }
    if (newPassword === currentPassword) {
      Toast.show({
        type: 'error',
        text1: 'New password must be different from the current one',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }

    try {
      const response = await changePassword({
        body: { currentPassword, newPassword },
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Password changed successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not change password',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Change Password" isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Current Password</Text>
          <CustomTextInput
            placeholder="Enter current password"
            isPassword
            inputHeight={height * 0.06}
            inputWidth={width * 0.9}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New Password</Text>
          <CustomTextInput
            placeholder="Enter new password"
            isPassword
            inputHeight={height * 0.06}
            inputWidth={width * 0.9}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password</Text>
          <CustomTextInput
            placeholder="Re-enter new password"
            isPassword
            inputHeight={height * 0.06}
            inputWidth={width * 0.9}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.rulesWrap}>
          <View style={styles.ruleRow}>
            <Text style={styles.bullet}>{'•'}</Text>
            <Text style={styles.ruleText}>
              At least {MIN_PASSWORD_LENGTH} characters long, 12 or more is better.
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.bullet}>{'•'}</Text>
            <Text style={styles.ruleText}>
              A mix of uppercase, lowercase, numbers, and symbols.
            </Text>
          </View>
        </View>

        <CustomButton
          text={isPending ? 'Changing...' : 'Change Password'}
          onPress={handleChangePassword}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
          disabled={isPending}
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
  sectionTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
    marginTop: height * 0.005,
  },
  rulesWrap: {
    marginTop: height * 0.005,
    gap: height * 0.012,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    marginRight: width * 0.02,
  },
  ruleText: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    lineHeight: fontSizes.sm * 1.4,
  },
});

export default ChangePasswordScreen;
