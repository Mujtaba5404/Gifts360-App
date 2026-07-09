import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../utils/colors';
import UserForm from './UserForm';
import { useUsers } from './UsersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateUser'>;

const CreateUser = ({ navigation }: Props) => {
  const { addUser } = useUsers();

  return (
    <View style={styles.container}>
      <TopHeader text="Create User" isBack />
      <UserForm
        submitLabel="Create user"
        onSubmit={values => {
          addUser(values);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default CreateUser;
