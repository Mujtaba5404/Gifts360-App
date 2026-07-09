import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../../assets/Fonts';
import images from '../../assets/Images';
import { CustomButton, CustomTextInput } from '../../components';
import { useSignIn } from '../../api/useSignIn';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Props = NativeStackScreenProps<RootStackParamList, 'SignInEmail'>;

const SignInEmail = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { signIn, isPending } = useSignIn();

  const isEmailValid = email.includes('@');

  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    setEmailTouched(true);
    setPasswordTouched(true);

    try {
      const response = await signIn({
        body: {
          email,
          password,
        },
      });
      console.log(response);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Signed in successfully',
      });

      navigation.navigate('Home');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: error?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image source={images.Logogifts360} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome back</Text>
          <View style={styles.inputMain}>
            <View>
              <CustomTextInput
                placeholder="Email Address"
                placeholderTextColor={colors.black}
                inputHeight={height * 0.05}
                inputWidth={width * 0.85}
                value={email}
                onChangeText={setEmail}
                onBlur={() => setEmailTouched(true)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {showEmailError && (
                <Text style={styles.errorText}>
                  Please enter a valid email address.
                </Text>
              )}
            </View>

            <View>
              <CustomTextInput
                placeholder="Password"
                placeholderTextColor={colors.black}
                inputHeight={height * 0.05}
                inputWidth={width * 0.85}
                isPassword={true}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setPasswordTouched(true)}
                keyboardType="default"
              />
            </View>

            <View style={{ alignItems: 'center', top: height * 0.04 }}>
              <CustomButton
                btnHeight={height * 0.05}
                btnWidth={width * 0.85}
                text={isPending ? 'Signing in...' : 'Login'}
                backgroundColor={colors.mantineBlue}
                textColor={colors.white}
                // onPress={handleLogin}
                onPress={() => navigation.navigate('Home')}
                disabled={isPending}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.55,
    height: height * 0.2,
    resizeMode: 'contain',
    top: height * 0.05,
  },
  welcomeText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.black,
    top: height * 0.08,
  },
  inputMain: {
    marginTop: height * 0.12,
    gap: height * 0.01,
    borderRadius: 25,
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.sm ? fontSizes.sm - 2 : 11,
    fontFamily: fontFamily.UrbanistMedium,
    marginTop: 4,
    marginLeft: width * 0.02,
  },
});

export default SignInEmail;
