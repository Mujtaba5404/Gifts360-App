import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, CustomTextInput, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { useUsers } from './UsersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EditUser'>;

const EditUser = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const { users, updateUser } = useUsers();
  const existing = users.find(user => user.id === userId);

  const [name, setName] = useState(existing?.name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [error, setError] = useState('');

  const handleUpdate = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail.includes('@')) {
      setError('Please enter a name and a valid email address.');
      return;
    }

    updateUser(userId, trimmedName, trimmedEmail);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Edit User" isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <CustomTextInput
            placeholder="Full Name"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <CustomTextInput
            placeholder="Email Address"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

          <CustomButton
            text="Save"
            btnHeight={height * 0.06}
            btnWidth={width * 0.9}
            backgroundColor={colors.darkGreen}
            textColor={colors.white}
            borderRadius={12}
            onPress={handleUpdate}
          />
        </View>
      </ScrollView>
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
    paddingBottom: height * 0.04,
  },
  form: {
    gap: height * 0.018,
    alignItems: 'center',
  },
  errorText: {
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
  },
});

export default EditUser;
