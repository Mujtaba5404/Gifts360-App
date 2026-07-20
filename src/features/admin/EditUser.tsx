import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  getUserName,
  getUserRoleId,
  useUpdateUser,
  useUser,
  useUsers,
} from '../../api/useUsers';
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../utils/colors';
import { getBrandOptions, getRoleOptions } from './options';
import UserForm, { UserFormValues } from './UserForm';

type Props = NativeStackScreenProps<RootStackParamList, 'EditUser'>;

const EditUser = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const queryClient = useQueryClient();

  const { updateUser, isPending } = useUpdateUser();
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useUser(userId);

  // Role/brand ke options mojooda users se aate hain.
  const { data: usersData, isLoading: isLoadingOptions } = useUsers({
    page: 1,
    pageSize: 100,
  });
  const users = useMemo(() => usersData?.data ?? [], [usersData]);

  const roleOptions = useMemo(() => getRoleOptions(users), [users]);
  const brandOptions = useMemo(() => getBrandOptions(users), [users]);

  // API kabhi record ko `data` ke andar bhejta hai, kabhi top level par.
  const initialValues = useMemo(() => {
    if (!userData) return undefined;

    const user: any = (userData as any).data ?? (userData as any);

    return {
      name: getUserName(user),
      email: user.email ?? '',
      password: '',
      brands: user.brands ?? [],
      usesBrandAliases: !!user.usesBrandAliases,
      roleId: getUserRoleId(user.role),
      isActive: user.isActive ?? true,
    };
  }, [userData]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      const res = await updateUser({
        id: userId,
        name: values.name,
        email: values.email,
        // Khali password ka matlab "badalna nahi hai" — tab field bhejte hi nahi.
        ...(values.password.length > 0 && { password: values.password }),
        brands: values.brands,
        usesBrandAliases: values.usesBrandAliases,
        role: values.roleId,
        isActive: values.isActive,
      });

      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['user', userId] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'User updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not update user',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Edit User" isBack />
      <UserForm
        submitLabel="Save"
        submittingLabel="Saving..."
        roleOptions={roleOptions}
        brandOptions={brandOptions}
        isLoadingOptions={isLoadingOptions}
        initialValues={initialValues}
        isLoadingInitial={isLoadingUser || !initialValues}
        hasLoadError={isUserError}
        loadErrorText="Could not load this user."
        requirePassword={false}
        isPending={isPending}
        onSubmit={onSubmit}
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

export default EditUser;
