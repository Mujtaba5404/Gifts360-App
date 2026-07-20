import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ComponentProps, ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdminSettings from '../features/admin/AdminSettings';
import Profile from '../features/auth/Profile';
import Home from '../features/home/Home';
import { width } from '../utils';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();


const ICON_COLOR = colors.mantineBlue;

const ICON_SIZE = 26;

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { outline: IconName; filled: IconName }> = {
  Home: { outline: 'home-outline', filled: 'home' },
  AdminSettings: { outline: 'settings-outline', filled: 'settings' },
  Profile: { outline: 'person-outline', filled: 'person' },
};

const renderTabIcon = (routeName: string, isFocused: boolean): ReactNode => {
  const icons = TAB_ICONS[routeName];
  if (!icons) return null;

  return (
    <Ionicons
      name={isFocused ? icons.filled : icons.outline}
      size={ICON_SIZE}
      color={ICON_COLOR}
    />
  );
};

const INDICATOR_RATIO = 0.4;

const AnimatedTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;
  const indicatorWidth = tabWidth * INDICATOR_RATIO;

  const offsetFor = (index: number) =>
    index * tabWidth + (tabWidth - indicatorWidth) / 2;

  const translateX = useRef(new Animated.Value(offsetFor(state.index))).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: offsetFor(state.index),
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
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
            {renderTabIcon(route.name, isFocused)}
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
    backgroundColor: ICON_COLOR,
  },
  tab: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabs;