import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { fontFamily } from '../../assets/Fonts';
import images from '../../assets/Images';
import { CustomButton, CustomTextInput } from '../../components';
import { extractAuthTokens, useSignIn } from '../../api/useSignIn';
import { RootStackParamList } from '../../navigation/types';
import {
  setLogin,
  setRefreshToken,
  setToken,
  setUser,
  setUserEmail,
} from '../../redux/slice/roleSlice';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Props = NativeStackScreenProps<RootStackParamList, 'SignInEmail'>;

const SignInEmail = ({ navigation }: Props) => {
  const dispatch = useDispatch();

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

      const { accessToken, refreshToken, user } = extractAuthTokens(response);

      if (!accessToken) {
        if (__DEV__) {
          console.log('SignInEmail: unexpected response shape', response);
        }
        throw new Error('Sign in succeeded but no access token was returned.');
      }

      // Token store kiye bagair har agli API call "no token provided" se fail hoti hai,
      // kyunke axios interceptor Authorization header isi state se banata hai.
      dispatch(setToken(accessToken));
      dispatch(setRefreshToken(refreshToken || null));
      dispatch(setUser(user ?? {}));
      dispatch(setUserEmail(user?.email ?? email));
      dispatch(setLogin());

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
      <ImageBackground source={images.background} style={{ flex: 1 }}>
        <View style={styles.overlayContainer}>
          <View style={styles.card}>
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
            </View>
            <View style={{ alignItems: 'center', }}>
              <CustomButton
                btnHeight={height * 0.05}
                btnWidth={width * 0.85}
                text={isPending ? 'Signing in...' : 'Login'}
                backgroundColor={colors.mantineBlue}
                textColor={colors.white}
                onPress={handleLogin}
                disabled={isPending}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.49,
    bottom: height * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 25,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: width * 0.55,
    height: height * 0.2,
    resizeMode: 'contain',
    bottom: height * 0.04,
  },
  welcomeText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.black,
    bottom: height * 0.05,
  },
  inputMain: {
    gap: height * 0.01,
    width: '100%',
    alignItems: 'center',
    bottom: height * 0.03,
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
