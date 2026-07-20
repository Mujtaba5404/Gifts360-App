import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { fontFamily } from '../assets/Fonts';
import { RootStackParamList } from '../navigation/types';
import { RootState } from '../redux/store';
import { getDisplayName, getDisplayEmail } from '../utils/user';
import { height, width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type IconName = ComponentProps<typeof Ionicons>['name'];

type MenuItem = {
  label: string;
  icon: IconName;
  route?: keyof RootStackParamList;
};

const DRAWER_WIDTH = width * 0.75;

const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', icon: 'home-outline'},
  { label: 'Customers', icon: 'people-outline', route: 'Customers' },
  { label: 'Vendors', icon: 'business-outline', route: 'Vendors' },
  { label: 'Expenses', icon: 'card-outline', route: 'ExpensesFlatList' },
  { label: 'Petty Cash', icon: 'cash-outline', route: 'PettyCash' },
  { label: 'Purchase Orders', icon: 'wallet-outline', route: 'PurchaseOrdersFlatList' },
  { label: 'Sale Orders', icon: 'receipt-outline', route: 'SalesOrdersFlatList' },
  { label: 'Items', icon: 'cube-outline', route: 'ItemsFlatList' },
  { label: 'Payrolls', icon: 'people-circle-outline', route: 'PayrollsFlatList' },
];

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const SideDrawer = ({ visible, onClose }: SideDrawerProps) => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const user = useSelector((state: RootState) => state.role.user);
  const userEmail = useSelector((state: RootState) => state.role.userEmail);
  const displayName = getDisplayName(user, userEmail);
  const displayEmail = getDisplayEmail(user, userEmail);

  const [rendered, setRendered] = useState(visible);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => finished && setRendered(false));
    }
  }, [visible, translateX, backdrop]);

  if (!rendered) {
    return null;
  }

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
          <Pressable style={styles.flex} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.close}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={width * 0.07} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Ionicons
                  name="person"
                  size={width * 0.09}
                  color={colors.white}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name} numberOfLines={1}>
                  {displayName}
                </Text>
                {!!displayEmail && (
                  <Text style={styles.email} numberOfLines={1}>
                    {displayEmail}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.flex}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menu}
          >
            {MENU_ITEMS.map((item, index) => (
              <View key={item.label}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    onClose();
                    if (item.route) {
                      navigation.navigate(item.route as never);
                    }
                  }}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={item.icon}
                    size={width * 0.05}
                    color={colors.mantineBlue}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
                {index !== MENU_ITEMS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  menu: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.04,
    paddingHorizontal: width * 0.02,
  },
  menuIcon: {
    marginRight: width * 0.04,
  },
  menuText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.gray,
    marginVertical: height * 0.015,
    alignSelf: 'center',
    justifyContent: 'center',
    width: DRAWER_WIDTH - width * 0.1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.white,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.mantineBlue,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
  },
  close: {
    alignSelf: 'flex-end',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.035,
    marginTop: height * 0.01,
  },
  avatar: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.white,
  },
  email: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.white,
  },
});

export default SideDrawer;