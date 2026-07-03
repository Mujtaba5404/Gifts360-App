import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import images from '../../assets/Images';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { StackParamList } from '../../navigation/MainStack';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Props = NativeStackScreenProps<StackParamList, 'SignInEmail'>;

const MIN_PASSWORD_LENGTH = 6;
 
const SignInEmail = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= MIN_PASSWORD_LENGTH;

  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;
  const showPasswordError = passwordTouched && password.length > 0 && !isPasswordValid;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const handleLogin = () => {
  setEmailTouched(true);
  setPasswordTouched(true);

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  navigation.navigate('Home');
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
                keyboardType='email-address'
                autoCapitalize='none'
              />
              {showEmailError && (
                <Text style={styles.errorText}>Please enter a valid email address.</Text>
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
                keyboardType='default'
              />
              {showPasswordError && (
                <Text style={styles.errorText}>
                  Password must be at least {MIN_PASSWORD_LENGTH} characters.
                </Text>
              )}
            </View>

            <View style={{ alignItems: 'center', top: height * 0.04 }}>
              <CustomButton
                btnHeight={height * 0.05}
                btnWidth={width * 0.85}
                text="Login"
                backgroundColor={colors.darkGreen}
                textColor={colors.white}
                onPress={handleLogin}
              />
            </View>
          </View>
        </View>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={colors.marhoon} />
          </View>
        )}
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
    fontWeight: "700",
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
  belowMain: {
    marginTop: height * 0.03,
  },
  continueImg: {
    width: width * 0.8,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  socialMain: {
    flexDirection: 'row',
    justifyContent: "center"
  },
  scialImg: {
    width: width * 0.25,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  memberMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.01,
  },
  memberText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },
  signUpText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.marhoon,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default SignInEmail;