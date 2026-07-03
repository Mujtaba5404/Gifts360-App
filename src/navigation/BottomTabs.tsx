// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Image, View } from 'react-native';
// import images from '../assets/Images';
// import { height, width } from '../utils';
// import { colors } from '../utils/colors';
// import Home from '../features/home/Home';
// import Profile from '../features/auth/Profile';

// const Tab = createBottomTabNavigator();

// const BottomTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           position: 'absolute',
//           bottom: height * 0.05,
//           width: width * 0.95,
//           backgroundColor: colors.white,
//           borderRadius: 30,
//           height: height * 0.07,
//           paddingBottom: height * 0.05,
//           paddingTop: height * 0.015,
//           elevation: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 backgroundColor: focused ? colors.darkGreen : 'transparent',
//                 padding: height * 0.015,
//                 borderRadius: 50,
//               }}
//             >
//               <Image
//                 source={images.homeIcon}
//                 style={{
//                   width: 24,
//                   height: 24,
//                   resizeMode: 'contain',
//                   tintColor: focused ? colors.white : colors.gray,
//                 }}
//               />
//             </View>
//           ),
//         }}
//       />

//       {/* <Tab.Screen
//         name="MediaLibrary"
//         component={}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 backgroundColor: focused ? colors.marhoon : 'transparent',
//                 padding: height * 0.015,
//                 borderRadius: 50,
//               }}
//             >
//               <Image
//                 source={images.bottomTabSecIcon}
//                 style={{
//                   width: 24,
//                   height: 24,
//                   resizeMode: 'contain',
//                   tintColor: focused ? colors.white : colors.Gray,
//                 }}
//               />
//             </View>
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ECommerce"
//         component={}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 backgroundColor: focused ? colors.marhoon : 'transparent',
//                 padding: height * 0.015,
//                 borderRadius: 50,
//               }}
//             >
//               <Image
//                 source={images.eCommerceIcon}
//                 style={{
//                   width: 24,
//                   height: 24,
//                   resizeMode: 'contain',
//                   tintColor: focused ? colors.white : colors.Gray,
//                 }}
//               />
//             </View>
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Chat"
//         component={}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 backgroundColor: focused ? colors.marhoon : 'transparent',
//                 padding: height * 0.015,
//                 borderRadius: 50,
//               }}
//             >
//               <Image
//                 source={images.chatIcon}
//                 style={{
//                   width: 24,
//                   height: 24,
//                   resizeMode: 'contain',
//                   tintColor: focused ? colors.lightGray : colors.Gray,
//                 }}
//               />
//             </View>
//           ),
//         }}
//       /> */}

//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 backgroundColor: focused ? colors.darkGreen : 'transparent',
//                 padding: 10,
//                 borderRadius: 50,
//               }}
//             >
//               <Image
//                 source={images.profileIcon}
//                 style={{
//                   width: 24,
//                   height: 24,
//                   resizeMode: 'contain',
//                   tintColor: focused ? colors.white : colors.gray,
//                 }}
//               />
//             </View>
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default BottomTabs;

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View } from 'react-native';
import images from '../assets/Images';
import { width } from '../utils';
import { colors } from '../utils/colors';
import Home from '../features/home/Home';
import Profile from '../features/auth/Profile';

const Tab = createBottomTabNavigator();

// Facebook jaisa active/inactive color
const ACTIVE_COLOR = colors.darkGreen; // FB me ye #1877F2 hota hai, apni brand color rakh lo
const INACTIVE_COLOR = colors.gray;

const TabIcon = ({ focused, icon }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', width: width * 0.18 }}>
    {/* Active indicator line - FB style */}
    <View
      style={{
        height: 3,
        width: '50%',
        backgroundColor: focused ? ACTIVE_COLOR : 'transparent',
        borderRadius: 2,
        marginBottom: 6,
      }}
    />
    <Image
      source={icon}
      style={{
        width: 26,
        height: 26,
        resizeMode: 'contain',
        tintColor: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
      }}
    />
  </View>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'relative',
          backgroundColor: colors.white,
          borderTopWidth: 0.5,
          borderTopColor: '#E4E6EB',
          height: 55,
          paddingTop: 0,
          paddingBottom: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={images.homeIcon} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={images.profileIcon} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;