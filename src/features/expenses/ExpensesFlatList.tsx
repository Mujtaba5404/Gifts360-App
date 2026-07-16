import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Expense, useExpenses } from '../../api/useExpenses';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { getPaymentModeLabel } from './paymentModes';
import formatAmount from '../../utils/formatAmount';
import formatDate from '../../utils/formatDate';
import capitalizeLetters from '../../utils/capitalizeLetters';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const toTitleCase = (str: string) =>
  str
    ?.trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') ?? '';

// Payment mode ke hisaab se apna color — cash green, cheque amber, baqi neutral
const PAYMENT_MODE_COLORS: Record<string, string> = {
  cash: '#10B981',
  cheque: '#F59E0B',
  bank: '#3B82F6',
  card: '#8B5CF6',
  online: '#EC4899',
};

const getPaymentModeColor = (mode?: string) => {
  if (!mode) return colors.gray;
  return PAYMENT_MODE_COLORS[mode.toLowerCase()] ?? colors.mantineBlue;
};

const ExpensesFlatList = () => {
  const navigation = useNavigation<Nav>();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useExpenses({
      page: 1,
      pageSize: 100,
      sort: '-date',
    });

  const expenses = data?.data ?? [];

  const renderItem = ({ item }: { item: Expense }) => {
    const payeeName = toTitleCase(item.payee);
    const paymentModeLabel = getPaymentModeLabel(item.paymentMode);
    const modeColor = getPaymentModeColor(item.paymentMode);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('EditExpenses', { expense: item })}
      >
        <View style={styles.row}>
          <Text style={styles.payee} numberOfLines={1}>
            {capitalizeLetters(payeeName)}
          </Text>
          <Text style={styles.amount} numberOfLines={1}>
            {formatAmount(item.amount)}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.tagRow}>
            {item.type?.title ? (
              <View style={styles.typePill}>
                <Text style={styles.typePillText} numberOfLines={1}>
                  {capitalizeLetters(item.type.title)}
                </Text>
              </View>
            ) : null}

            {item.category?.title ? (
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText} numberOfLines={1}>
                  {capitalizeLetters(item.category.title)}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.modeCol}>
            {paymentModeLabel ? (
              <View
                style={[styles.modePill, { backgroundColor: modeColor + '1A' }]}
              >
                <Text
                  style={[styles.modePillText, { color: modeColor }]}
                  numberOfLines={1}
                >
                  {capitalizeLetters(paymentModeLabel)}
                </Text>
              </View>
            ) : null}

            {item.paymentReference ? (
              <Text style={styles.rightRef} numberOfLines={1}>
                #{item.paymentReference}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.emptyText}>
            {error?.message || 'Could not load expenses.'}
          </Text>
          <CustomButton
            text="Retry"
            onPress={() => refetch()}
            btnHeight={height * 0.055}
            btnWidth={width * 0.4}
            backgroundColor="transparent"
            textColor={colors.mantineBlue}
            borderColor={colors.mantineBlue}
            borderWidth={1}
            borderRadius={8}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={expenses}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses added yet.</Text>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Expenses" isBack />

      <View style={styles.content}>
        {renderBody()}
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateExpenses')}
      >
        <View style={styles.fabIcon}>
          <Ionicons name="add" size={width * 0.055} color={colors.mantineBlue} />
        </View>
        <Text style={styles.fabText}>Add Expense</Text>
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: height * 0.02,
  },
  emptyText: {
    marginTop: height * 0.04,
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    flexGrow: 1,
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
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: width * 0.03,
  },
  payee: {
    flexShrink: 1,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  amount: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.mantineBlue,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.mantineBlue + '1A',
  },
  typePillText: {
    fontSize: fontSizes.xs ?? 12,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.mantineBlue + '1A',
  },
  categoryPillText: {
    fontSize: fontSizes.xs ?? 12,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  rightDate: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  modePillText: {
    fontSize: fontSizes.xs ?? 12,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
  },
  modeCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  rightRef: {
    fontSize: fontSizes.xs ?? 12,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default ExpensesFlatList;
