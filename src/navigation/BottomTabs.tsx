import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../assets/Images';
import AdminSettings from '../features/admin/AdminSettings';
import Profile from '../features/auth/Profile';
import Home from '../features/home/Home';
import { width } from '../utils';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

// Active / inactive tab colors
const ACTIVE_COLOR = colors.darkGreen;
const INACTIVE_COLOR = colors.gray;

const ICON_SIZE = 26;

// Icon renderer per route. Home/Profile use the existing PNG assets (tinted),
// AdminSettings uses a vector icon since it has no image asset.
const TAB_ICONS: Record<string, (color: string) => ReactNode> = {
  Home: color => (
    <Image
      source={images.homeIcon}
      style={[styles.icon, { tintColor: color }]}
    />
  ),
  Profile: color => (
    <Image
      source={images.profileIcon}
      style={[styles.icon, { tintColor: color }]}
    />
  ),
  AdminSettings: color => (
    <Ionicons name="settings" size={ICON_SIZE} color={color} />
  ),
};

// Fraction of a tab slot the sliding indicator line occupies.
const INDICATOR_RATIO = 0.4;

/**
 * Custom bottom tab bar with a single indicator line that smoothly slides
 * between tabs as the active route changes.
 */
const AnimatedTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;
  const indicatorWidth = tabWidth * INDICATOR_RATIO;

  // Where the indicator sits (left edge) for a given tab index.
  const offsetFor = (index: number) =>
    index * tabWidth + (tabWidth - indicatorWidth) / 2;

  // Initialise at the active tab so there's no jump on first render.
  const translateX = useRef(new Animated.Value(offsetFor(state.index))).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: offsetFor(state.index),
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
    // offsetFor depends only on tabWidth/indicatorWidth (derived from width).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, tabWidth, indicatorWidth]);

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <Animated.View
        style={[
          styles.indicator,
          { width: indicatorWidth, transform: [{ translateX }] },
        ]}
      />
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            style={[styles.tab, { width: tabWidth }]}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
          >
            {TAB_ICONS[route.name]?.(
              isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // react-navigation *calls* tabBar as a function, so the hook-using
      // component must be rendered as an element (not passed by reference),
      // otherwise its hooks run outside a render → "Invalid hook call".
      // AnimatedTabBar is module-scoped, so this arrow is stable in practice.
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <AnimatedTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="AdminSettings" component={AdminSettings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E4E6EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
  },
  tab: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
});

export default BottomTabs;
