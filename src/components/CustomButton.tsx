import React, { ReactNode } from 'react';
import {
    FlexStyle,
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import { height, width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

interface CustomButtonProps {
    onPress?: (event: GestureResponderEvent) => void;
    text: string;
    btnHeight?: number;
    btnWidth?: number;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    borderRadius?: number;
    disabled?: any;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    justifyContent?: FlexStyle['justifyContent'];
    paddingHorizontal?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    text,
    btnHeight = height * 0.07,
    btnWidth = width * 0.85,
    textColor,
    borderColor,
    borderRadius = 8,
    borderWidth,
    fontSize = fontSizes.sm,
    backgroundColor,
    fontFamily: textFontFamily,
    disabled,
    leftIcon,
    rightIcon,
    justifyContent = 'center',
    paddingHorizontal,
}) => {
    const hasIcon = Boolean(leftIcon || rightIcon);

    return (
        <TouchableOpacity
            style={[
                styles.customBtnMain,
                {
                    height: btnHeight,
                    width: btnWidth,
                    backgroundColor,
                    borderWidth,
                    borderColor,
                    borderRadius,
                    justifyContent,
                    paddingHorizontal,
                    gap: hasIcon ? width * 0.02 : 0,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.6}
            disabled={disabled}
        >
            {leftIcon}
            <Text
                style={[
                    styles.customBtnText,
                    { color: textColor, fontSize, fontFamily: textFontFamily },
                ]}
            >
                {text}
            </Text>
            {rightIcon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    customBtnMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
    },
    customBtnText: {
        fontFamily: fontFamily.UrbanistBold,
        fontSize: fontSizes.sm,
        textAlign: 'center',
        color: colors.black,
    },
});

export default CustomButton;
