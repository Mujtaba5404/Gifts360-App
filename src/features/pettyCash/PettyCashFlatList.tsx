import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useMemo } from 'react';
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
import {
  PettyCashEntry,
  PettyCashRow,
  formatDisplayDate,
  withRunningBalance,
} from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DUMMY_DATA: PettyCashEntry[] = [
  {
    id: '1',
    date: '2026-07-01T00:00:00.000Z',
    name: 'Ali Traders',
    description: 'Office supplies',
    account: 'Cash',
    amount: 7500,
  },
  {
    id: '2',
    date: '2026-07-03T00:00:00.000Z',
    name: 'Chai / Snacks',
    description: 'Staff refreshments',
    account: 'Cash',
    amount: 1200,
  },
  {
    id: '3',
    date: '2026-07-05T00:00:00.000Z',
    name: 'Careem',
    description: 'Client meeting travel',
    account: 'Card',
    amount: 650,
  },
];

const PettyCashFlatList = () => {
  const navigation = useNavigation<Nav>();

  const rows = useMemo(() => withRunningBalance(DUMMY_DATA), []);

  const renderItem = ({ item }: { item: PettyCashRow }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('EditPettyCash', { entry: item })}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDisplayDate(new Date(item.date))} · {item.account}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.amount}>Rs {item.amount.toLocaleString()}</Text>
        <Text style={styles.balance}>
          Bal: Rs {item.balance.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopHeader text="Petty Cash" isBack />

      <View style={styles.content}>
        <CustomButton
          text="Add Petty Cash"
          onPress={() => navigation.navigate('CreatePettyCash')}
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

        {rows.length === 0 ? (
          <Text style={styles.emptyText}>No petty cash added yet.</Text>
        ) : (
          <FlatList
            data={rows}
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
  description: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  meta: {
    marginTop: 4,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  balance: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default PettyCashFlatList;
