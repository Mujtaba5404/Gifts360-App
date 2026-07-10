import AntDesign from '@react-native-vector-icons/ant-design';
import React, { useState } from 'react';
import {
  DimensionValue,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { width } from '../utils';
import { colors } from '../utils/colors';
import { fontFamily } from '../assets/Fonts';
import { fontSizes } from '../utils/fontSizes';

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputWidth?: DimensionValue;
  inputHeight?: DimensionValue;
  isPassword?: boolean;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  backgroundColor?: string;
  onRightIconPress?: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  leftIcon,
  rightIcon,
  placeholder,
  placeholderTextColor,
  inputWidth = '100%' as DimensionValue,
  inputHeight = 50 as DimensionValue,
  isPassword = false,
  keyboardType = 'default',
  multiline = false,
  borderColor,
  borderWidth = 1,
  borderRadius = 8,
  backgroundColor = colors.white,
  onChangeText,
  value,
  onRightIconPress,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleRightIconPress = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const isActive = isFocused || (value && value.length > 0);

  return (
    <View
      style={[
        styles.container,
        {
          height: inputHeight,
          width: inputWidth,
          borderWidth,
          borderRadius,
          borderColor: isActive ? colors.mantineBlue : colors.lightGray,
          backgroundColor: colors.white,
        },
      ]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
      
        placeholder={placeholder}
        placeholderTextColor={
          placeholderTextColor ||
          (backgroundColor === colors.gray ? colors.black : colors.black)
        }
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={[
          styles.input,
          {
            color:
              backgroundColor === colors.gray ? colors.black : colors.black,
          },
        ]}
        secureTextEntry={isPassword ? showPassword : false}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />

      {rightIcon && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={handleRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      )}

      {isPassword && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={handleRightIconPress}
        >
          <AntDesign
            name={showPassword ? 'eye-invisible' : 'eye'}
            size={18}
            color={colors.Gray}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    color: colors.black,
    fontFamily: fontFamily.GilroyMedium,
    fontSize: fontSizes.xsm,
  },
  leftIcon: {
    marginRight: 10,
    left: 10,
  },
  rightIcon: {
    paddingLeft: width * 0.03,
    right: 10,
  },
});

export default CustomTextInput;
