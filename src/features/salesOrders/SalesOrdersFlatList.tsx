import { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { AddFab, CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { SalesOrder, useSalesOrders } from '../../api/useSalesOrders';
import formatDate from '../../utils/formatDate';
import formatAmount from '../../utils/formatAmount';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_META: Record<
  SalesOrder['orderStatus'],
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending', color: '#B54708', bg: '#FFF4E5' },
  confirmed: { label: 'Confirmed', color: '#0C8599', bg: '#E3F8FA' },
  processing: { label: 'Processing', color: '#6741D9', bg: '#F1EBFC' },
  delivered: { label: 'Delivered', color: '#2B8A3E', bg: '#E8F7EC' },
  cancelled: { label: 'Cancelled', color: '#C2255C', bg: '#FDECF1' },
  returned: { label: 'Returned', color: '#C2255C', bg: '#FDECF1' },
};

const INITIAL_PAGE_SIZE = 50;

const SalesOrdersFlatList = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);

  const { data, isLoading, isError, refetch, isRefetching } = useSalesOrders({
    page: 1,
    pageSize,
  });

  useEffect(() => {
    const totalCount = data?.meta?.totalCount;
    if (totalCount && totalCount > pageSize) {
      setPageSize(totalCount);
    }
  }, [data?.meta?.totalCount, pageSize]);

  const salesOrders = data?.data ?? [];
  const salesOrdersCount = data?.meta?.totalCount ?? 0;


  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return salesOrders;
    return salesOrders.filter(order => {
      const haystack = [
        order.orderId,
        order.customer?.title,
        STATUS_META[order.orderStatus]?.label,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [salesOrders, query]);

  const renderItem = ({ item }: { item: SalesOrder }) => {
    const statusMeta = STATUS_META[item.orderStatus];
    const customerName = item.customer?.title ?? 'Unknown customer';
    const itemsCount = item.items?.length ?? 0;
    const totalAmount = item.grandTotal;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate('SalesOrderDetailScreen', { orderId: item._id })
        }
      >
        <View style={styles.cardTop}>
          <View style={styles.poIcon}>
            <Ionicons
              name="receipt-outline"
              size={width * 0.055}
              color={colors.mantineBlue}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.poNumber} numberOfLines={1}>
              {item.orderId}
            </Text>
            <Text style={styles.vendor} numberOfLines={1}>
              {capitalizeLetters(customerName)}
            </Text>
          </View>

          <View
            style={[styles.statusBadge, { backgroundColor: statusMeta?.bg }]}
          >
            <Text style={[styles.statusText, { color: statusMeta?.color }]}>
              {statusMeta?.label ?? item.orderStatus}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBottom}>
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={width * 0.032}
              color={colors.gray}
            />
            <Text style={styles.meta}>{formatDate(item.orderDate)}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="cube-outline"
              size={width * 0.032}
              color={colors.gray}
            />
            <Text style={styles.meta}>
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </Text>
          </View>

          <Text style={styles.amount}>{formatAmount(totalAmount)}</Text>
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
          <Text style={styles.emptyText}>Failed to load sales orders.</Text>
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

    if (salesOrders.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="receipt-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>No sales orders added yet.</Text>
        </View>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="search-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>
            No sales orders match "{query.trim()}".
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredOrders}
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
                ListHeaderComponent={<Text>{salesOrdersCount} salesOrder(s)</Text>}

      />
    );
  };

  const showSearch = !isLoading && !isError && salesOrders.length > 0;

  return (
    <View style={styles.container}>
      <TopHeader text="Sales Orders" isBack />

      <View style={styles.content}>
        {showSearch && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={width * 0.045} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search SO # or customer"
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
        label="Add"
        subtitle="Sales Order"
        onPress={() => navigation.navigate('CreateSalesOrder')}
        bottom={height * 0.065}
        fabWidth={width * 0.4}
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
  countText: {
    marginBottom: height * 0.012,
    color: colors.gray,
    fontSize: fontSizes.sm,
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
  poIcon: {
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
  poNumber: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  vendor: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  statusBadge: {
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: 20,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.014,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.045,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.012,
  },
  meta: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  amount: {
    marginLeft: 'auto',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
});

export default SalesOrdersFlatList;