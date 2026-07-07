import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import { height, width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';


interface TopHeaderProps {
  text?: string;
  textIcon?: boolean;
  title?: string;
  transparent?: boolean;
  isBack?: boolean;
  isBackReps?: boolean;
  isBackBlack?: boolean;
  steps?: string;
  isMenu?: boolean;
  isMenuSec?: boolean;
  notification?: boolean;
  notificationSec?: boolean;
  notificationImage?: 'notiSec' | string;
  menuSecond?: 'MenuColor' | string;
  backSec?: 'whiteArrow' | string;
  add?: boolean;
  isClose?: boolean;
  isChat?: boolean;
  isWhite?: boolean;
  setIsCompleted?: () => void;
  isQr?: boolean;
  isBlueBg?: boolean;
  statusToggle?: boolean;
  toggleSwitch?: (newState: any) => void;
  toggleValue?: boolean;
  addCard?: boolean;
  onAddCardPress?: () => void;
  msgIcon?: boolean;

  favIcon?: boolean;
  videoId?: number;
  productId?: number;
  onFavouritePress?: (videoId: number, productId: number, isCurrentlyFavourite: boolean) => void;
  isFavourite?: boolean; // Add this to control which icon to show

  skip?: boolean;
  list?: boolean;
  backIcon?: boolean;
  isPhone?: boolean;
  isBackWhite?: boolean;
  isProfile?: boolean;
  isCart?: boolean;
  isBackHome?: boolean;
  isCross?: boolean;
}

// type DrawerNavProp = DrawerNavigationProp<any>;

const TopHeader: React.FC<TopHeaderProps> = ({
  text,
  textIcon = false,
  transparent = false,
  isBack = false,
  isBackReps = false,
  isBackBlack = false,
  isMenu = false,
  notification = false,
  notificationSec = false,
  isChat = false,
  isClose = false,
  setIsCompleted,
  isQr = false,
  isBlueBg = false,
  addCard = false,
  onAddCardPress,
  msgIcon = false,

  favIcon = false,
  videoId,
  productId,
  onFavouritePress,
  isFavourite = false, // Default to false

  skip = false,
  isPhone = false,
  isBackWhite = false,
  isProfile = false,
  isCart = false,
  isBackHome = false,
  isCross = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [notiCount, setNotiCount] = useState(0)
//   const drawerNavigation = useNavigation<DrawerNavProp>();
  const navigation = useNavigation<any>();
//   const User = useSelector((state: RootState) => state.role.user)
//   const fullName = User?.firstName && User?.lastName ? `${User.firstName} ${User.lastName}` : "Name";
//   const displayName = fullName.length > 10 ? `${fullName.slice(0, 8)}...` : fullName;
//   const { count, refreshCount } = useNotificationCount();

//   const handleDrawer = () => {
//     drawerNavigation.openDrawer();
//     console.log("Drawer Icon Clicked!")
//   };

  const handleFavouritePress = async () => {
    if (!onFavouritePress || (!videoId && !productId)) {
      console.log("No videoId or productId or onFavouritePress provided");
      return;
    }

    try {
      onFavouritePress(videoId ?? 0, productId ?? 0, isFavourite);
    } catch (error) {
      console.error("Error handling favourite press:", error);
    }
  };

  const BASE_URL = 'http://18.204.175.233:3001/';

  const getFullImageUrl = (path: string) => {
    if (!path) return undefined;
    return `${BASE_URL}${path}`;
  };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       refreshCount();
//     });
//     refreshCount();
//     return unsubscribe;
//   }, [navigation, refreshCount]);

  return (
    <View
      style={{
        backgroundColor: isBlueBg ? colors.darkBlue : 'transparent',
      }}
    >
      <SafeAreaView>
        <View style={styles.MainHeader}>
          {isBack && (
            <Pressable
              style={styles.headerArrow}
              onPress={() => {
                if (navigation) {
                  navigation.canGoBack()
                    ? navigation.goBack()
                    : navigation.navigate('Home' as never);
                }
              }}
            >
              <Image source={images.backIcon} style={styles.backArrow} />
            </Pressable>
          )}
          {isCross && (
            <Pressable
              style={styles.headerArrow}
              onPress={() => {
                // if (navigation) {
                //   navigation.canGoBack()
                //     ? navigation.goBack()
                //     : navigation.navigate('Home' as never);
                // }
                navigation.popToTop();
              }}
            >
              <Image source={images.crossBlack} style={styles.crossImg} />
            </Pressable>
          )}
          {isBackBlack && (
            <Pressable
              style={styles.headerArrow}
              onPress={() => {
                if (navigation) {
                  navigation.canGoBack()
                    ? navigation.goBack()
                    : navigation.navigate('Home' as never);
                }
              }}
            >
              <Image source={images.isBack} style={styles.backArrowBlack} />
            </Pressable>
          )}
          {isBackHome && (
            <Pressable
              style={styles.headerArrow}
              onPress={() => {
                if (navigation) {
                  // navigation.canGoBack()
                  // ? navigation.goBack()
                  navigation.navigate('AppDrawer');
                }
              }}
            >
              <Image source={images.backIcon} style={styles.backArrow} />
            </Pressable>
          )}
          {isBackReps && (
            <Pressable
              style={styles.headerArrow}
              onPress={() => {
                if (navigation) {
                  // navigation.canGoBack()
                  // ? navigation.goBack()
                  navigation.navigate('LoveDepositReps');
                }
              }}
            >
              <Image source={images.backIcon} style={styles.backArrow} />
            </Pressable>
          )}
          {isBackWhite && (
            <TouchableOpacity
              style={styles.headerArrow}
              activeOpacity={0.7}
              onPress={() => {
                // if (navigation) {
                //   navigation.canGoBack()
                //     ? navigation.goBack()
                //     : navigation.navigate('Home' as never);
                // }
                navigation.popToTop();
              }}
            >
              <Image source={images.isBack} style={styles.backArrowBlack} />
            </TouchableOpacity>
          )}
          {isClose && (
            <Pressable
              style={styles.headerArrow}
            >
              {transparent ? (
                <Image source={images.closeTopWhite} style={styles.closeTop} />
              ) : (
                <Image source={images.closeTop} style={styles.closeTop} />
              )}
            </Pressable>
          )}
          {isMenu && (
            <Pressable style={styles.headerArrow}>
              <Image
                source={images.drawerIcon}
                style={styles.menuIcon}
              />
            </Pressable>
          )}
          <Text
            style={[
              styles.MainHeaderText,
              { color: transparent ? colors.white : colors.black },
            ]}
          >
            {text}
          </Text>

          {textIcon && (
            <View>
              <Text
                style={[
                  styles.MainHeaderText,
                  { color: transparent ? colors.white : colors.black },
                ]}
              >
                {text}
              </Text>
            </View>
          )}
          {/* {notification && (
            <View style={[styles.headerBell, { right: -width * 0.02 }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationsScreen')}
              >
                {count > 0 && (  
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>
                      {count > 99 ? '99+' : count}  
                    </Text>
                  </View>
                )}
                <View style={styles.bellImgContainer}>
                  <Image source={images.bell} style={styles.bellImg} />
                </View>
              </TouchableOpacity>
            </View>
          )} */}
          {isPhone && (
            <View style={styles.headerBell}>
              <TouchableOpacity
                activeOpacity={0.7}
              // onPress={() => navigation.navigate('CallMain')}
              >
                <Image source={images.phoneBlack} style={styles.isChatImg} />
              </TouchableOpacity>
            </View>
          )}
          {addCard && (
            <TouchableOpacity
              style={styles.headeraddCard}
              onPress={onAddCardPress}
            >
              {/* <Text style={styles.addCardText}>Add Card</Text> */}
              <Image source={images.addCard} />
            </TouchableOpacity>
          )}
          {msgIcon && (
            <TouchableOpacity style={styles.headerBell}>
              <Image source={images.messageIcon} style={styles.msgIcon} />
            </TouchableOpacity>
          )}
          {favIcon && (
            <TouchableOpacity
              style={styles.headerBell}
              activeOpacity={0.7}
              // onPress={() => navigation.navigate("Favourites")}
              onPress={handleFavouritePress}
            >
              <Image source={isFavourite ? images.filledFav : images.favIcon} style={styles.favIcon} />
            </TouchableOpacity>
          )}
          {skip && (
            <TouchableOpacity style={styles.headerBell}>
              <Text style={styles.skipCardText}>Skip</Text>
            </TouchableOpacity>
          )}
          {isChat && (
            <View style={styles.headerBell}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                // onPress={() => navigation.navigate('CallMain')}
                >
                  <Image source={images.phoneBlack} style={styles.isChatImg} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                // onPress={() => navigation.navigate('Chat')}
                >
                  <Image source={images.chat} style={styles.isChatImg} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* {isProfile && (
            <View style={styles.headerProfile}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Image
                    // source={images.headerprofile}
                    source={
                      User?.image
                        ? { uri: getFullImageUrl(User.image) }
                        : images.headerprofile
                    }
                    // style={styles.isChatImg}
                    // source={User?.image && !imgError ? { uri: getFullImageUrl(User.image) } : images.drawerProf}
                    style={styles.isChatImg}
                    onError={() => setImgError(true)} // <-- prevent broken images
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <View
                    style={{
                      flexDirection: 'column',
                      left: width * 0.01,
                    }}
                  >
                    <Text style={styles.headerWelcome}>Welcome</Text>
                    <Text style={styles.headerJaydon}>
                      {displayName}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )} */}
          {isCart && (
            <TouchableOpacity activeOpacity={0.7} style={styles.headerBell} onPress={() => navigation.navigate("Cart")}>
              <Image source={images.cartIcon} style={styles.cartIconImg} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBadge: {
    position: 'absolute',
    top: -5, // Adjust as needed
    right: width * 0.29, // Adjust position based on your bellImg width
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },

  notificationBadgeSec: {
    position: 'absolute',
    top: -5, // Adjust as needed
    right: -width * 0.01, // Adjust position based on your bellImgSec width
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },

  notificationCount: {
    color: colors.white,
    fontSize: fontSizes.xsm,
    fontFamily: fontFamily.Inter,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },

  notificationCountSec: {
    color: colors.white,
    fontSize: fontSizes.xsm,
    fontFamily: fontFamily.Inter,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  isChatImg: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'cover',
    borderRadius: width * 0.1
  },
  MainHeader: {
    display: 'flex',
    flexDirection: 'row',
    height: width * 0.15,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    position: 'relative',
    marginHorizontal: width * 0.04,
  },
  headerArrow: {
    position: 'absolute',
    height: '100%',
    alignContent: 'center',
    top: 0,
    left: 0,
    justifyContent: 'center',
  },
  headerBell: {
    position: 'absolute',
    height: '100%',
    alignContent: 'center',
    top: 0,
    right: 0,
    justifyContent: 'center',
  },
  headeraddCard: {
    position: 'absolute',
    height: '100%',
    alignContent: 'center',
    top: height * 0.001,
    left: width * 0.78,
    justifyContent: 'center',
  },
  headerProfile: {
    position: 'absolute',
    height: '100%',
    alignContent: 'center',
    top: 0,
    right: 0,
    justifyContent: 'center',
  },
  MainHeaderText: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: width * 0.11,
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    color: colors.black,
  },
  backArrow: {
    width: width * 0.09,
    height: height * 0.09,
    resizeMode: 'contain',
  },
  crossImg: {
    width: width * 0.05,
    height: height * 0.09,
    resizeMode: 'contain',
  },
  backArrowBlack: {
    width: width * 0.05,
    height: height * 0.017,
    resizeMode: 'contain',
  },
  closeTop: {
    width: width * 0.04,
    resizeMode: 'contain',
  },
  headerBellNoti: {
    position: 'absolute',
    width: width * 0.04,
    height: width * 0.04,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.orange,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
  },
  bellImg: {
    width: width * 0.087,
    // right: width * 0.32,
    resizeMode: 'contain',
  },
  bellImgSec: {
    width: width * 0.11,
    resizeMode: 'contain',
    right: width * 0.01
  },
  notiText: {
    fontSize: width * 0.02,
    color: colors.white,
    fontFamily: fontFamily.Inter,
  },
  menuIcon: {
    width: width * 0.086,
    resizeMode: 'contain',
  },
  onlineText: {
    color: colors.gradient2,
    position: 'absolute',
    top: '24%',
    left: 23,
    zIndex: 100,
    fontFamily: fontFamily.SegoeUIBold,
    fontSize: 14,
  },
  offlineText: {
    color: colors.white,
    position: 'absolute',
    top: '24%',
    right: 23,
    zIndex: 100,
    fontFamily: fontFamily.SegoeUIBold,
    fontSize: 14,
  },
  thumbStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
  },
  addCardText: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.OpenSansBold,
    textDecorationLine: 'underline',
    color: colors.darkBlue,
  },
  skipCardText: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.OpenSansBold,
    textDecorationLine: 'underline',
    color: colors.white,
  },
  msgIcon: {
    backgroundColor: colors.darkBlue,
    width: Platform.OS === 'ios' ? width * 0.08 : width * 0.07,
    height: Platform.OS === 'ios' ? width * 0.08 : height * 0.02,
    padding: Platform.OS === 'ios' ? 8 : 15,
    borderRadius: 30,
  },
  favIcon: {
    left: width * 0.88,
    top: height * 0.003,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    height: height * 0.09,
    width: width * 1,
    marginTop: Platform.OS === 'ios' ? height * 0.6 : height * 0.6,
    borderColor: colors.borderGray,
    borderWidth: 2,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    alignItems: 'center',
  },
  modalBlur: {
    flex: 1,
    width: width,
    height: height,
    position: 'absolute',
  },
  filterImg: {
    width: width * 0.5,
    height: width * 0.018,
  },
  imgMain: {
    paddingTop: height * 0.01,
  },
  belowMain: {
    width: width * 0.75,
    paddingTop: height * 0.02,
    gap: height * 0.03,
  },
  Main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  text1: {
    fontFamily: fontFamily.JakartaMedium,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  ExcImg: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  border: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    width: width * 0.9,
    right: width * 0.09,
  },
  checkboxMain: {
    flexDirection: 'column',
    gap: height * 0.01,
    right: width * 0.04,
  },
  text: {
    color: colors.black,
    fontFamily: fontFamily.JakartaRegular,
    left: width * 0.08,
  },
  headerWelcome: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.xsm,
    color: colors.black,
  },
  headerJaydon: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  cartIconImg: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
    right: Platform.OS === 'ios' ? width * 0.42 : width * 0.42
  },
  DrawerImgContainer: {
    borderWidth: 2,
    borderRadius: 200,
    height: height * 0.042,
    width: width * 0.096,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: colors.white,
  },
  bellImgContainer:{
    borderWidth: 2,
    borderRadius: 200,
    height: height * 0.042,
    width: width * 0.096,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: colors.white,
    right: width * 0.32,
  }
});

export default TopHeader;