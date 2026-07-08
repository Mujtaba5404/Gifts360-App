import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useEffect, useRef, useState } from 'react';
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
import { fontFamily } from '../assets/Fonts';
import CustomButton from './CustomButton';
import { RootStackParamList } from '../navigation/types';
import { height, width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DRAWER_WIDTH = width * 0.8;
const MENU_ITEMS = [
  'Home',
  'My Orders',
  'Get Help',
  'Payment Methods',
];

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const SideDrawer = ({ visible, onClose }: SideDrawerProps) => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

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

  const handleLogout = () => {
    onClose();
    navigation.navigate('SignInEmail');
  };

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
          <Pressable style={styles.flex} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[styles.panel, { transform: [{ translateX }] }]}
        >
          {/* Header */}
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
                <Text style={styles.name}>Mujtaba</Text>
                <Text style={styles.email}>mujtaba@gifts360.com</Text>
              </View>
            </View>
          </View>

          {/* Menu items */}
          <ScrollView
            style={styles.flex}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menu}
          >
            {MENU_ITEMS.map(item => (
              <CustomButton
                key={item}
                text={item}
                onPress={onClose}
                btnHeight={height * 0.06}
                btnWidth={DRAWER_WIDTH - width * 0.1}
                backgroundColor={colors.cardBg}
                textColor={colors.black}
                borderRadius={30}
                justifyContent="flex-start"
                paddingHorizontal={width * 0.06}
              />
            ))}
          </ScrollView>


          <View
            style={[
              styles.logoutWrap,
            ]}
          >
            <CustomButton
              text="Logout"
              onPress={handleLogout}
              btnHeight={height * 0.062}
              btnWidth={DRAWER_WIDTH - width * 0.1}
              backgroundColor={colors.darkGreen}
              textColor={colors.white}
              borderRadius={30}
              justifyContent="space-between"
              paddingHorizontal={width * 0.06}
              rightIcon={
                <Ionicons
                  name="exit-outline"
                  size={width * 0.06}
                  color={colors.white}
                />
              }
            />
          </View>
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
    backgroundColor: colors.darkGreen,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
    borderBottomRightRadius: 24,
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
  menu: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.025,
    gap: height * 0.015,
  },
  logoutWrap: {
    alignItems: 'center',
    bottom: height * 0.1,
  },
});

export default SideDrawer;
