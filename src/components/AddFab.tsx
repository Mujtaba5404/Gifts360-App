import { Ionicons } from '@react-native-vector-icons/ionicons';
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import { height, width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

interface AddFabProps {
  label: string;
  onPress: () => void;
  /** Har list apni position rakhti hai, is liye override kiya ja sakta hai. */
  bottom?: number;
  fabWidth?: DimensionValue;
}

/**
 * Saari list screens par "Add ..." ka floating pill button.
 */
const AddFab = ({
  label,
  onPress,
  bottom = height * 0.035,
  fabWidth,
}: AddFabProps) => (
  <TouchableOpacity
    style={[styles.fab, { bottom }, fabWidth !== undefined && { width: fabWidth }]}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <View style={styles.fabIcon}>
      <Ionicons name="add" size={width * 0.055} color={colors.mantineBlue} />
    </View>
    <Text style={styles.fabText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: width * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    height: height * 0.062,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.05,
    borderRadius: height * 0.031,
    backgroundColor: colors.mantineBlue,
    shadowColor: colors.mantineBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.045,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.white,
  },
});

export default AddFab;
