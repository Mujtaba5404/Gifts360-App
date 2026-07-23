import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../utils/colors';
import RoleForm from './RoleForm';
import { useRoles } from './RolesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRole'>;

const CreateRole = ({ navigation }: Props) => {
  const { addRole } = useRoles();

  return (
    <View style={styles.container}>
      <TopHeader text="Create Role" isBack />
      <RoleForm
        submitLabel="Create role"
        onSubmit={async values => {
          await addRole(values);
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

export default CreateRole;
