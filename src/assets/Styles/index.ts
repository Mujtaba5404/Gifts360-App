import {
    ImageStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { height, width, isAndroid } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { fontFamily } from '../Fonts';

interface GlobalStyles {
    secMain: StyleProp<ViewStyle>;
    bg: ViewStyle;
    container: ViewStyle;
    TextInput: TextStyle;
    TextInputMain: ViewStyle;
    leftIcon: ImageStyle;
    passwordRightIcon: ViewStyle;
    eye: ImageStyle;
    containerInner: ViewStyle;
    selectInput: ViewStyle;
    selectText: TextStyle;
    textInputShadow: ViewStyle;
}

export const globalStyle = StyleSheet.create({
    secMain: {
        width: width,
        height: isAndroid ? height * 0.68 : height * 0.62,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    bg: {
        flex: 1,
        height: height,
        width: width,
    },
    container: {
        backgroundColor: colors.bg,
        flex: 1,
    },
    containerInner: {
        backgroundColor: colors.white,
        flex: 1,
    },
    TextInput: {
        width: '100%',
        height: '100%',
        color: colors.black,
        fontFamily: fontFamily.OpenSansRegular,
        fontSize: fontSizes.sm,
    },
    textInputShadow: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    },
    TextInputMain: {
        backgroundColor: colors.lightGray,
        borderRadius: 7,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        width: '100%',
    },
    selectInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
    },
    searchInput: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        height: height * 0.06,
        paddingHorizontal: width * 0.03,
        gap: width * 0.02,
        borderColor: colors.searchInputBorder,
        backgroundColor: colors.white,
    },
    searchInputMain: {
        color: colors.textPrimary,
        width: '85%',
        alignItems: 'center',
    },
    passwordRightIcon: {
        width: 20,
    },
    leftIcon: {
        width: 18,
        resizeMode: 'contain',
    },
    rightIcon: {
        width: 18,
        resizeMode: 'contain',
    },
    eye: {
        width: 20,
        resizeMode: 'contain',
    },
    selectText: {
        fontFamily: fontFamily.JakartaMedium,
        // fontWeight:'400',
        color: colors.black,
        fontSize: fontSizes.sm,
    },
    phoneInput: {
        color: colors.black,
        fontFamily: fontFamily.JakartaRegular,
        width: width * 0.85,
    },
});