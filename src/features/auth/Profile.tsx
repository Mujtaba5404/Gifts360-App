import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ComponentProps } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { RootState } from '../../redux/store';
import { removeUser } from '../../redux/slice/roleSlice';
import { getDisplayName, getDisplayEmail } from '../../utils/user';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = ComponentProps<typeof Ionicons>['name'];

// Only routes that don't require params can be opened straight from the menu.
type ParamlessRoute = {
  [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined ? K : never;
}[keyof RootStackParamList];

const MENU_ITEMS: { icon: IconName; label: string; route: ParamlessRoute }[] = [
  // { icon: 'person-outline', label: 'Edit Profile', route: 'EditProfile' },
  // { icon: 'notifications-outline', label: 'Notifications', route: 'Notifications' },
  // { icon: 'settings-outline', label: 'Settings', route: 'Settings' },
  { icon: 'lock-closed-outline', label: 'Change Password', route: 'ChangePasswordScreen' },
];

const Profile = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.role.user);
  const userEmail = useSelector((state: RootState) => state.role.userEmail);
  const displayName = getDisplayName(user, userEmail);
  const displayEmail = getDisplayEmail(user, userEmail);

  const handleLogout = () => {
    dispatch(removeUser());
    navigation.navigate('SignInEmail');
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Avatar + identity */}
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={width * 0.12} color={colors.white} />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          {!!displayEmail && (
            <Text style={styles.email} numberOfLines={1}>
              {displayEmail}
            </Text>
          )}
        </View>

        {/* Settings menu */}
        <View style={styles.card}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.6}
              onPress={() => navigation.navigate(item.route)}
              style={[
                styles.row,
                index === MENU_ITEMS.length - 1 && styles.rowLast,
              ]}
            >
              <View style={styles.rowIcon}>
                <Ionicons
                  name={item.icon}
                  size={width * 0.05}
                  color={colors.mantineBlue}
                />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={width * 0.045}
                color={colors.gray}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logout}>
          <CustomButton
            text="Log Out"
            btnHeight={height * 0.05}
            btnWidth={width * 0.85}
            backgroundColor={colors.mantineBlue}
            textColor={colors.white}
            onPress={handleLogout}
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
    paddingBottom: height * 0.04,
  },
  identity: {
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.035,
  },
  avatar: {
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: width * 0.12,
    backgroundColor: colors.mantineBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: height * 0.015,
    fontSize: fontSizes.lg,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  email: {
    marginTop: 4,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  logout: {
    top: height * 0.4,
    alignItems: 'center',
  },
});

export default Profile;
