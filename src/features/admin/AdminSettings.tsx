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
import { fontFamily } from '../../assets/Fonts';
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = ComponentProps<typeof Ionicons>['name'];

// Only params-less destinations are linkable from here.
type AdminRoute = 'Users' | 'Roles';

const ADMIN_OPTIONS: {
  icon: IconName;
  label: string;
  route?: AdminRoute;
}[] = [
  {
    icon: 'shield-checkmark-outline',
    label: 'Role and Permissions',
    route: 'Roles',
  },
  { icon: 'people-outline', label: 'Users', route: 'Users' },
];

const AdminSettings = () => {
  const navigation = useNavigation<Nav>();

  const handlePress = (route?: AdminRoute) => {
    if (route) {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Admin Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.list}>
          {ADMIN_OPTIONS.map(item => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.6}
              style={styles.optionCard}
              onPress={() => handlePress(item.route)}
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
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
  },
  list: {
    gap: height * 0.015,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
});

export default AdminSettings;
