import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useCreateUser, useUsers } from '../../api/useUsers';
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../utils/colors';
import { getBrandOptions, getRoleOptions } from './options';
import UserForm, { UserFormValues } from './UserForm';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateUser'>;

const CreateUser = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const { createUser, isPending } = useCreateUser();

  const { data: usersData, isLoading: isLoadingOptions } = useUsers({
    page: 1,
    pageSize: 100,
  });
  const users = useMemo(() => usersData?.data ?? [], [usersData]);

  const roleOptions = useMemo(() => getRoleOptions(users), [users]);
  const brandOptions = useMemo(() => getBrandOptions(users), [users]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      const res = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        brands: values.brands,
        usesBrandAliases: values.usesBrandAliases,
        role: values.roleId,
        isActive: values.isActive,
      });

      await queryClient.invalidateQueries({ queryKey: ['users'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'User created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not create user',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Create User" isBack />
      <UserForm
        submitLabel="Create user"
        submittingLabel="Creating..."
        roleOptions={roleOptions}
        brandOptions={brandOptions}
        isLoadingOptions={isLoadingOptions}
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

export default CreateUser;
