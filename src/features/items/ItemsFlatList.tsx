import { useMemo, useState } from 'react';
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
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { Item, useItems } from '../../api/useItems';
import formatAmount from '../../utils/formatAmount';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type StockStatus = 'outOfStock' | 'lowStock' | 'inStock';

const STOCK_STATUS_META: Record < StockStatus,
  { label: string; color: string; bg: string }
> = {
  outOfStock: { label: 'Out of Stock', color: '#C2255C', bg: '#FDECF1' },
  lowStock: { label: 'Low Stock', color: '#B54708', bg: '#FFF4E5' },
  inStock: { label: 'In Stock', color: '#2B8A3E', bg: '#E8F7EC' },
};

const getStockStatus = (item: Item): StockStatus => {
  const stock = item.stockInHand ?? 0;
  const reorderLevel = item.reorderLevel ?? 0;
  if (stock <= 0) return 'outOfStock';
  if (stock <= reorderLevel) return 'lowStock';
  return 'inStock';
};

const PAGE_SIZE = 500;

const ItemsFlatList = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useItems({ page: 1, pageSize: PAGE_SIZE });

  const items = data?.data ?? [];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => {
      const haystack = [item.title, item.sku, item.category?.title]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  const renderItem = ({ item }: { item: Item }) => {
    const stockStatus = getStockStatus(item);
    const statusMeta = STOCK_STATUS_META[stockStatus];
    const stock = item.stockInHand ?? 0;
    const unitLabel = item.unit?.value ? ` ${item.unit.value}` : '';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() =>
          (navigation as any).navigate('EditItem', { item })
        }
      >
        <View style={styles.cardTop}>
          <View style={styles.poIcon}>
            <Ionicons
              name="cube-outline"
              size={width * 0.055}
              color={colors.mantineBlue}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.poNumber} numberOfLines={1}>
              {capitalizeLetters(item.title)}
            </Text>
            <View style={styles.subInfoRow}>
              {!!item.sku && (
                <Text style={styles.vendor} numberOfLines={1}>
                  {item.sku}
                </Text>
              )}
              {!!item.sku && !!item.category?.title && (
                <Text style={styles.dot}>{'\u2022'}</Text>
              )}
              {!!item.category?.title && (
                <Text style={styles.vendor} numberOfLines={1}>
                  {capitalizeLetters(item.category.title)}
                </Text>
              )}
            </View>
          </View>

          <View
            style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}
          >
            <Text style={[styles.statusText, { color: statusMeta.color }]}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBottom}>
          <View style={styles.metaRow}>
            <Ionicons
              name="layers-outline"
              size={width * 0.032}
              color={colors.gray}
            />
            <Text style={styles.meta}>
              {stock}
              {unitLabel} in stock
            </Text>
          </View>

          {item.isPerishable && (
            <View style={styles.metaRow}>
              <Ionicons
                name="snow-outline"
                size={width * 0.032}
                color={colors.gray}
              />
              <Text style={styles.meta}>Perishable</Text>
            </View>
          )}

        </View>


        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Ionicons
                name="pricetag-outline"
                size={width * 0.03}
                color={colors.mantineBlue}
              />
              <Text style={styles.statLabel}>Avg Cost</Text>
            </View>
            <Text style={styles.statValue}>
              {formatAmount(item.averageUnitCost)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Ionicons
                name="wallet-outline"
                size={width * 0.03}
                color={colors.mantineBlue}
              />
              <Text style={styles.statLabel}>Stock Value</Text>
            </View>
            <Text style={styles.statValue}>
              {formatAmount(item.costOfStockInHand)}
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
          <Text style={styles.emptyText}>Failed to load items.</Text>
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

    if (items.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="cube-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>No items added yet.</Text>
        </View>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="search-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>
            No items match "{query.trim()}".
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredItems}
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
      />
    );
  };

  const showSearch = !isLoading && !isError && items.length > 0;

  return (
    <View style={styles.container}>
      <TopHeader text="Items" isBack />

      <View style={styles.content}>
        {showSearch && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={width * 0.045} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items, SKU or category"
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

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() =>
          (navigation as any).navigate('CreateItem')
        }
      >
        <View style={styles.fabIcon}>
          <Ionicons
            name="add"
            size={width * 0.055}
            color={colors.mantineBlue}
          />
        </View>
        <Text style={styles.fabText}>Add Item</Text>
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
  list: {
    marginTop: height * 0.025,
    paddingBottom: height * 0.12,
    gap: height * 0.015,
  },
  fab: {
    position: 'absolute',
    right: width * 0.06,
    bottom: height * 0.065,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    height: height * 0.062,
    width: width * 0.4,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.05,
    borderRadius: height * 0.03,
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
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  vendor: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  dot: {
    fontSize: fontSizes.xs,
    color: colors.gray,
    marginHorizontal: 4,
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
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.012,
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
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
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
  statDivider: {
    width: 1,
    height: height * 0.03,
    backgroundColor: colors.border,
    marginHorizontal: width * 0.03,
  },
});

export default ItemsFlatList;