import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { Customer } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DUMMY_DATA: Customer[] = [
  {
    id: '1',
    name: 'Ali Traders',
    phone: '0300-1234567',
    address: 'Shop 12, Tariq Road, Karachi',
  },
  {
    id: '2',
    name: 'Hina Gift House',
    phone: '0321-9876543',
    address: 'Main Boulevard, Gulberg, Lahore',
  },
  {
    id: '3',
    name: 'Bilal Khan',
    phone: '0333-4567890',
    address: 'Blue Area, Islamabad',
  },
];

const CustomersFlatList = () => {
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('EditCustomer', { customer: item })}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.phone} numberOfLines={1}>
          {item.phone}
        </Text>
        <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
          {item.address}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={width * 0.05}
        color={colors.gray}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopHeader text="Customers" isBack />

      <View style={styles.content}>
        <CustomButton
          text="Add Customer"
          onPress={() => navigation.navigate('CreateCustomer')}
          btnHeight={height * 0.06}
          btnWidth={width * 0.9}
          backgroundColor="transparent"
          textColor={colors.mantineBlue}
          borderColor={colors.mantineBlue}
          borderWidth={1}
          borderRadius={8}
          leftIcon={
            <Ionicons
              name="add"
              size={width * 0.06}
              color={colors.mantineBlue}
            />
          }
        />

        {DUMMY_DATA.length === 0 ? (
          <Text style={styles.emptyText}>No customers added yet.</Text>
        ) : (
          <FlatList
            data={DUMMY_DATA}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  emptyText: {
    marginTop: height * 0.04,
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    marginTop: height * 0.035,
    paddingBottom: height * 0.04,
    gap: height * 0.015,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  phone: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  address: {
    marginTop: 4,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default CustomersFlatList;
