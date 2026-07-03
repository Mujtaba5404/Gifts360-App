import React, { useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { fontFamily } from '../assets/Fonts';
import { globalStyle } from '../assets/Styles';
import { height,width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

interface CustomPhoneInputProps {
  placeholder?: string;
  inputWidth?: number | undefined;
  inputHeight?: number;
  maxLength?: number;
  value?: any;
  onChangeText?: any;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  placeholder,
  inputWidth = 0.9,
  inputHeight,
  maxLength,
  value,
  onChangeText,
}) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<TextInput | null>(null);

  const handleCountrySelect = (item: { dial_code: string }) => {
    setCountryCode(item.dial_code);
    setShowModal(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
  };

  return (
    <View style={[styles.phoneInputMain, { width: width * inputWidth }]}>
      <TouchableOpacity
        style={[styles.phoneInputFlag, { height: inputHeight }]}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.numTextView}>
          <Text style={styles.numText}>{countryCode}</Text>
          <Ionicons
            name="chevron-down"
            size={width * 0.05}
            color={colors.textBlack}
          />
        </View>
      </TouchableOpacity>
      <View style={[styles.phoneInputNum, { height: inputHeight }]}>
        <TextInput
          ref={inputRef}
          placeholderTextColor={colors.black}
          placeholder={placeholder}
          style={[globalStyle.phoneInput, { color: colors.black }]}
          secureTextEntry={false}
          keyboardType="numeric"
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <CountryPicker
          show={showModal}
          pickerButtonOnPress={handleCountrySelect}
          style={{
            modal: {
              height: height * 0.7,
              backgroundColor: colors.lightBlue,
            },
            textInput: {
              color: colors.black,
            },
          }}
          lang=""
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneInputMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInputFlag: {
    backgroundColor: colors.trasparent,
    borderRadius: 7,
    width: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  phoneInputNum: {
    borderRadius: 7,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: width * 0.65,
    marginLeft: width * 0.01,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  numTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: width * 0.01,
  },
  numText: {
    fontFamily: fontFamily.JakartaBold,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
});

export default CustomPhoneInput;