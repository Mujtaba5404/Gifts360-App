import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ReactNode, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton } from '../../components';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

/* ---------- Labelled field wrapper ---------- */
export const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    {children}
  </View>
);

/* ---------- Checkbox with label ---------- */
export const Checkbox = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    style={styles.checkboxRow}
    activeOpacity={0.7}
    onPress={onToggle}
  >
    <Ionicons
      name={checked ? 'checkbox' : 'square-outline'}
      size={width * 0.06}
      color={checked ? colors.mantineBlue : colors.gray}
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- Dropdown (single or multi select) ---------- */
interface DropdownProps {
  placeholder: string;
  options: string[];
  selected: string[];
  multiple?: boolean;
  onChange: (values: string[]) => void;
}

export const Dropdown = ({
  placeholder,
  options,
  selected,
  multiple = false,
  onChange,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (option: string) => {
    if (multiple) {
      onChange(
        selected.includes(option)
          ? selected.filter(o => o !== option)
          : [...selected, option],
      );
    } else {
      onChange([option]);
      setOpen(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.select}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            styles.selectText,
            selected.length === 0 && styles.selectPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selected.length > 0 ? selected.join(', ') : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={width * 0.045}
          color={colors.gray}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownCard}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {options.map(option => {
                    const active = selected.includes(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={() => toggle(option)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                        {active && (
                          <Ionicons
                            name="checkmark"
                            size={width * 0.05}
                            color={colors.mantineBlue}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {multiple && (
                  <CustomButton
                    text="Done"
                    btnHeight={height * 0.055}
                    btnWidth={width * 0.8}
                    backgroundColor={colors.mantineBlue}
                    textColor={colors.white}
                    borderRadius={12}
                    onPress={() => setOpen(false)}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: height * 0.008,
  },
  label: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  required: {
    color: 'red',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.025,
  },
  checkboxLabel: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height * 0.06,
    paddingHorizontal: width * 0.03,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  selectText: {
    flex: 1,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  selectPlaceholder: {
    color: colors.gray,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  dropdownCard: {
    width: '100%',
    maxHeight: height * 0.6,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: width * 0.04,
    gap: height * 0.015,
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
});
