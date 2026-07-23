// PayrollsFlatList.tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Payroll, usePayrolls } from '../../api/usePayrolls';
import { fontFamily } from '../../assets/Fonts';
import { AddFab, CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { colors } from '../../utils/colors';
import formatAmount from '../../utils/formatAmount';
import { fontSizes } from '../../utils/fontSizes';
import { formatMonth } from './options';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PAGE_SIZE = 100;


const getEmployeeName = (employee?: Payroll['employee']) =>
  [employee?.personal?.firstName, employee?.personal?.lastName]
    .filter(Boolean)
    .join(' ') || 'Unknown employee';

const getEmployeeDesignation = (employee?: Payroll['employee']) =>
  employee?.organization?.designation?.title;

const PayrollsFlatList = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, error, refetch, isRefetching } = usePayrolls({ page: 1, pageSize: PAGE_SIZE});

  const payrolls = data?.data ?? [];
  const payrollsCount = data?.meta?.totalCount ?? 0;


  const filteredPayrolls = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return payrolls;
    return payrolls.filter(row => {
      const haystack = [
        getEmployeeName(row.employee),
        getEmployeeDesignation(row.employee),
        formatMonth(row.month),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [payrolls, query]);

  const renderItem = ({ item }: { item: Payroll }) => {
    const designation = getEmployeeDesignation(item.employee);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate('PayrollDetailScreen', { payrollId: item._id })
        }
      >
        <View style={styles.cardTop}>
          <View style={styles.payrollIcon}>
            <Ionicons
              name="person-outline"
              size={width * 0.055}
              color={colors.mantineBlue}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.employeeName} numberOfLines={1}>
              {capitalizeLetters(getEmployeeName(item.employee))}
            </Text>
            <Text style={styles.month} numberOfLines={1}>
              {formatMonth(item.month)}
              {designation ? ` · ${capitalizeLetters(designation)}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Salary</Text>
            <Text style={styles.statValue}>
              {formatAmount(item.salary)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Deduction</Text>
            <Text style={styles.statValue}>
              {formatAmount(item.deduction)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Net Salary</Text>
            <Text style={[styles.statValue, styles.netPayValue]}>
              {formatAmount(item.netSalary)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="cloud-offline-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>Failed to load payrolls.</Text>
          {!!error?.message && (
            <Text style={styles.errorDetail}>{error.message}</Text>
          )}
          <CustomButton
            text="Retry"
            onPress={() => refetch()}
            btnHeight={height * 0.05}
            btnWidth={width * 0.4}
            backgroundColor={colors.mantineBlue}
            textColor={colors.white}
            borderRadius={8}
          />
        </View>
      );
    }

    if (payrolls.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="people-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>No payrolls added yet.</Text>
        </View>
      );
    }

    if (filteredPayrolls.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="search-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>
            No payrolls match "{query.trim()}".
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredPayrolls}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={9}
        removeClippedSubviews
        ListHeaderComponent={<Text>{payrollsCount} payroll(s)</Text>}

      />
    );
  };

  const showSearch = !isLoading && !isError && payrolls.length > 0;

  return (
    <View style={styles.container}>
      <TopHeader text="Payrolls" isBack />

      <View style={styles.content}>
        {showSearch && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={width * 0.045} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employee or month"
              placeholderTextColor={colors.gray}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={width * 0.05}
                  color={colors.gray}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {renderList()}
      </View>

      <AddFab
        label="Add Payroll"
        onPress={() => navigation.navigate('CreatePayroll')}
        bottom={height * 0.065}
        fabWidth={width * 0.45}
      />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.025,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    height: height * 0.055,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  centerState: {
    marginTop: height * 0.06,
    alignItems: 'center',
    gap: height * 0.02,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  errorDetail: {
    textAlign: 'center',
    paddingHorizontal: width * 0.05,
    color: colors.gray,
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    marginTop: height * 0.025,
    paddingBottom: height * 0.12,
    gap: height * 0.015,
  },
  card: {
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.035,
  },
  payrollIcon: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.055,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  employeeName: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  month: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.014,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  statValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  netPayValue: {
    color: colors.mantineBlue,
  },
  statDivider: {
    width: 1,
    height: height * 0.03,
    backgroundColor: colors.border,
    marginHorizontal: width * 0.03,
  },
});

export default PayrollsFlatList;