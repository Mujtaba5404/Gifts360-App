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
import { TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { Vendor } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DUMMY_DATA: Vendor[] = [
  {
    id: '1',
    name: 'K-Electric',
    phone: '111-000-333',
    address: 'Elander Road, Karachi',
  },
  {
    id: '2',
    name: 'Paper Mart',
    phone: '0301-2223334',
    address: 'Paper Market, Saddar, Karachi',
  },
  {
    id: '3',
    name: 'Gift Wrap Co.',
    phone: '0345-6667778',
    address: 'Industrial Area, Lahore',
  },
];

const VendorsFlatList = () => {
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('EditVendor', { vendor: item })}
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
      <TopHeader text="Vendors" isBack />

      <View style={styles.content}>
        {DUMMY_DATA.length === 0 ? (
          <Text style={styles.emptyText}>No vendors added yet.</Text>
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

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateVendor')}
      >
        <View style={styles.fabIcon}>
          <Ionicons name="add" size={width * 0.055} color={colors.mantineBlue} />
        </View>
        <Text style={styles.fabText}>Add Vendor</Text>
      </TouchableOpacity>
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
  },
  emptyText: {
    marginTop: height * 0.04,
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    marginTop: height * 0.025,
    paddingBottom: height * 0.12,
    gap: height * 0.015,
  },
  fab: {
    position: 'absolute',
    right: width * 0.06,
    bottom: height * 0.06,
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

export default VendorsFlatList;
