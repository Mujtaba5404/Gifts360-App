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

type Nav = NativeStackNavigationProp<RootStackParamList>;

const formatDate = (iso: string) => {
  const parsed = new Date(iso);
  return isNaN(parsed.getTime())
    ? '-'
    : parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
};

const ExpensesFlatList = () => {
  const navigation = useNavigation<Nav>();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useExpenses({
      page: 1,
      pageSize: 100,
    });
  console.log('ExpensesFlatList: data', data);

  const expenses = data?.data ?? [];
  console.log('ExpensesFlatList: expenses', expenses);

  const renderItem = ({ item }: { item: Expense }) => {
    // Cash expenses ka koi reference nahi hota, is liye sirf tab jodo jab mile.
    const meta = [
      formatDate(item.date),
      getPaymentModeLabel(item.paymentMode),
      item.paymentReference,
    ]
      .filter(Boolean)
      .join(' · ');

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('EditExpenses', { expense: item })}
      >
        <View style={styles.info}>
          <Text style={styles.payee} numberOfLines={1}>
            {item.payee}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.amount}>Rs {item.amount.toLocaleString()}</Text>
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
        <CustomButton
          text="Add Expense"
          onPress={() => navigation.navigate('CreateExpenses')}
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

        {renderBody()}
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
  payee: {
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
});

export default ExpensesFlatList;
