import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { useUsers } from './UsersContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const Users = () => {
  const navigation = useNavigation<Nav>();
  const { users } = useUsers();

  return (
    <View style={styles.container}>
      <TopHeader text="Add User" isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Transparent add button (centered) */}
        <CustomButton
          text="Add Users"
          onPress={() => navigation.navigate('CreateUser')}
          btnHeight={height * 0.06}
          btnWidth={width * 0.9}
          backgroundColor="transparent"
          textColor={colors.mantineBlue}
          borderColor={colors.mantineBlue}
          borderWidth={1}
          borderRadius={8}
          leftIcon={
            <Ionicons
              name="add"
              size={width * 0.06}
              color={colors.mantineBlue}
            />
          }
        />

        {/* Saved user cards */}
        {users.length === 0 ? (
          <Text style={styles.emptyText}>No users added yet.</Text>
        ) : (
          <View style={styles.list}>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate('EditUser', { userId: user.id })
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={width * 0.045}
                  color={colors.gray}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  emptyText: {
    marginTop: height * 0.04,
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    marginTop: height * 0.035,
    gap: height * 0.015,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: colors.mantineBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  userEmail: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default Users;
