import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import RoleForm from './RoleForm';
import { useRoles } from './RolesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EditRole'>;

const EditRole = ({ route, navigation }: Props) => {
  const { roleId } = route.params;
  const { roles, updateRole } = useRoles();
  const existing = roles.find(role => role.id === roleId);

  return (
    <View style={styles.container}>
      <TopHeader text="Edit Role" isBack />
      {existing ? (
        <RoleForm
          initialValues={existing}
          submitLabel="Save"
          onSubmit={async values => {
            await updateRole(roleId, values);
            navigation.goBack();
          }}
        />
      ) : (
        <Text style={styles.missing}>Role not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  missing: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
});

export default EditRole;
