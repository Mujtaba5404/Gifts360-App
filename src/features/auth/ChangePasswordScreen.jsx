// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { Ionicons } from '@react-native-vector-icons/ionicons';
// import { useState } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { fontFamily } from '../assets/Fonts';
// import CustomButton from '../components/CustomButton';
// import { RootStackParamList } from '../navigation/types';
// import { height, width } from '../utils';
// import { colors } from '../utils/colors';
// import { fontSizes } from '../utils/fontSizes';

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// interface PasswordFieldProps {
//   placeholder: string;
//   value: string;
//   onChangeText: (text: string) => void;
// }

// const PasswordField = ({ placeholder, value, onChangeText }: PasswordFieldProps) => {
//   const [secure, setSecure] = useState(true);

//   return (
//     <View style={styles.fieldWrap}>
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor={colors.gray}
//         secureTextEntry={secure}
//         style={styles.input}
//       />
//       <TouchableOpacity
//         onPress={() => setSecure(prev => !prev)}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//       >
//         <Ionicons
//           name={secure ? 'eye-off-outline' : 'eye-outline'}
//           size={width * 0.055}
//           color={colors.black}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const ChangePasswordScreen = () => {
//   const navigation = useNavigation<Nav>();
//   const insets = useSafeAreaInsets();

//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleChangePassword = () => {
//     // TODO: hook up API call
//   };

//   return (
//     <LinearGradient
//       colors={[colors.gradientStart, colors.white, colors.gradientEnd]}
//       style={styles.flex}
//     >
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         {/* Header */}
//         <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
//           <TouchableOpacity
//             style={styles.back}
//             onPress={() => navigation.goBack()}
//             hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//           >
//             <Ionicons name="chevron-back" size={width * 0.07} color={colors.black} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Change Password</Text>
//         </View>

//         <ScrollView
//           style={styles.flex}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.content}
//         >
//           <PasswordField
//             placeholder="Current Password"
//             value={currentPassword}
//             onChangeText={setCurrentPassword}
//           />

//           <Text style={styles.sectionTitle}>Set New Password</Text>

//           <PasswordField
//             placeholder="New Password"
//             value={newPassword}
//             onChangeText={setNewPassword}
//           />

//           <PasswordField
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />

//           <View style={styles.rulesWrap}>
//             <View style={styles.ruleRow}>
//               <Text style={styles.bullet}>{'\u2022'}</Text>
//               <Text style={styles.ruleText}>
//                 At least 12 characters long but 14 or more is better.
//               </Text>
//             </View>
//             <View style={styles.ruleRow}>
//               <Text style={styles.bullet}>{'\u2022'}</Text>
//               <Text style={styles.ruleText}>
//                 A combination of uppercase letters, lowercase letters, numbers, and symbols.
//               </Text>
//             </View>
//           </View>
//         </ScrollView>

//         <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
//           <CustomButton
//             text="Change Password"
//             onPress={handleChangePassword}
//             btnHeight={height * 0.065}
//             btnWidth={width * 0.9}
//             backgroundColor={colors.primary}
//             textColor={colors.white}
//             borderRadius={30}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//     paddingBottom: height * 0.02,
//   },
//   back: {
//     position: 'absolute',
//     left: width * 0.05,
//     zIndex: 1,
//     backgroundColor: 'rgba(0,0,0,0.04)',
//     borderRadius: 20,
//     padding: 6,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: fontSizes.lg,
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '700',
//     color: colors.black,
//   },
//   content: {
//     paddingHorizontal: width * 0.05,
//     paddingTop: height * 0.02,
//     paddingBottom: height * 0.03,
//   },
//   fieldWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: colors.cardBg,
//     borderRadius: 20,
//     height: height * 0.075,
//     paddingHorizontal: width * 0.05,
//     marginBottom: height * 0.025,
//   },
//   input: {
//     flex: 1,
//     fontSize: fontSizes.md,
//     fontFamily: fontFamily.UrbanistMedium,
//     color: colors.black,
//     paddingVertical: 0,
//   },
//   sectionTitle: {
//     fontSize: fontSizes.md,
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '700',
//     color: colors.black,
//     marginBottom: height * 0.02,
//   },
//   rulesWrap: {
//     marginTop: height * 0.01,
//     gap: height * 0.012,
//   },
//   ruleRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   bullet: {
//     fontSize: fontSizes.sm,
//     fontFamily: fontFamily.UrbanistMedium,
//     color: colors.black,
//     marginRight: width * 0.02,
//   },
//   ruleText: {
//     flex: 1,
//     fontSize: fontSizes.sm,
//     fontFamily: fontFamily.UrbanistMedium,
//     color: colors.black,
//     lineHeight: fontSizes.sm * 1.4,
//   },
//   footer: {
//     paddingHorizontal: width * 0.05,
//     paddingTop: height * 0.01,
//     alignItems: 'center',
//   },
// });

// export default ChangePasswordScreen;