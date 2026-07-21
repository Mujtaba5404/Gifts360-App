import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useQueryClient } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Item, useDeleteItem, useItem } from '../../api/useItems';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { colors } from '../../utils/colors';
import formatAmount from '../../utils/formatAmount';
import formatDate from '../../utils/formatDate';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'ItemDetailScreen'>;


const DANGER_COLOR = '#C2255C';
const DANGER_TINT = '#FDECF1';
const EDIT_TINT = '#EDF0FE';

type StockStatus = 'outOfStock' | 'lowStock' | 'inStock';

const STOCK_STATUS_META: Record<
  StockStatus,
  { label: string; color: string; bg: string }
> = {
  outOfStock: { label: 'Out of Stock', color: '#C2255C', bg: '#FDECF1' },
  lowStock: { label: 'Low Stock', color: '#B54708', bg: '#FFF4E5' },
  inStock: { label: 'In Stock', color: '#2B8A3E', bg: '#E8F7EC' },
};

const getStockStatus = (item: Item): StockStatus => {
  const stock = item.stockInHand ?? 0;
  if (stock <= 0) return 'outOfStock';
  if (stock <= (item.reorderLevel ?? 0)) return 'lowStock';
  return 'inStock';
};

const DetailRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ItemDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const queryClient = useQueryClient();
  const { itemId } = route.params;

  const { data: item, isLoading, isError, refetch, isRefetching } =
    useItem(itemId);
  const { deleteItem, isPending: isDeleting } = useDeleteItem();

  const onEdit = () => navigation.navigate('EditItem', { itemId });

  const onDelete = () => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await deleteItem({ id: itemId });
            await queryClient.invalidateQueries({ queryKey: ['items'] });

            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: res?.message || 'Item deleted successfully',
            });

            navigation.goBack();
          } catch (err: any) {
            Toast.show({
              type: 'error',
              text1: 'Could not delete item',
              text2: err?.message || 'Something went wrong. Please try again.',
            });
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopHeader text="Item" isBack />
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      </View>
    );
  }

  if (isError || !item) {
    return (
      <View style={styles.container}>
        <TopHeader text="Item" isBack />
        <View style={styles.centerFill}>
          <Ionicons
            name="cloud-offline-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.errorText}>Could not load this item.</Text>
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
      </View>
    );
  }

  const statusMeta = STOCK_STATUS_META[getStockStatus(item)];
  const unitLabel = item.unit?.value ? ` ${item.unit.value}` : '';

  return (
    <View style={styles.container}>
      <TopHeader text={capitalizeLetters(item.title)} isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.profileCard}>
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.6}
              onPress={onEdit}
              disabled={isDeleting}
              hitSlop={10}
            >
              <Ionicons
                name="pencil"
                size={width * 0.036}
                color={colors.mantineBlue}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              activeOpacity={0.6}
              onPress={onDelete}
              disabled={isDeleting}
              hitSlop={10}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={DANGER_COLOR} />
              ) : (
                <Ionicons
                  name="trash"
                  size={width * 0.036}
                  color={DANGER_COLOR}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.profileAvatar}>
            <Ionicons
              name="cube-outline"
              size={width * 0.1}
              color={colors.white}
            />
          </View>

          <Text style={styles.profileTitle} numberOfLines={2}>
            {capitalizeLetters(item.title)}
          </Text>
          {!!item.sku && <Text style={styles.profileSku}>{item.sku}</Text>}

          <View
            style={[
              styles.statusBadge,
              styles.profileBadge,
              { backgroundColor: statusMeta.bg },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: statusMeta.color }]}>
              {statusMeta.label}
            </Text>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {item.stockInHand ?? 0}
                {unitLabel}
              </Text>
              <Text style={styles.profileStatLabel}>In Stock</Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatAmount(item.sellingPrice)}
              </Text>
              <Text style={styles.profileStatLabel}>Selling Price</Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatAmount(item.costOfStockInHand)}
              </Text>
              <Text style={styles.profileStatLabel}>Stock Value</Text>
            </View>
          </View>
        </View>

        {/* Stock */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock</Text>
          <View style={styles.card}>
            <DetailRow
              label="In Hand"
              value={`${item.stockInHand ?? 0}${unitLabel}`}
            />
            <DetailRow label="Reorder Level" value={`${item.reorderLevel ?? 0}`} />
            <DetailRow
              label="Avg Unit Cost"
              value={formatAmount(item.averageUnitCost)}
            />
            <DetailRow
              label="Stock Value"
              value={formatAmount(item.costOfStockInHand)}
              isLast
            />
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.card}>
            <DetailRow
              label="Selling Price"
              value={formatAmount(item.sellingPrice)}
            />
            <DetailRow
              label="Cost Price"
              value={formatAmount(item.costPrice)}
              isLast
            />
          </View>
        </View>

        {/* Description */}
        {!!item.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.card}>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.card}>
            <DetailRow
              label="Category"
              value={
                item.category?.title
                  ? capitalizeLetters(item.category.title)
                  : '-'
              }
            />
            <DetailRow label="Unit" value={item.unit?.title || '-'} />
            <DetailRow
              label="Perishable"
              value={item.isPerishable ? 'Yes' : 'No'}
            />
            <DetailRow label="Created By" value={capitalizeLetters(item.createdBy?.name || '-')} />
            <DetailRow label="Created On" value={formatDate(item.createdAt)} />
            <DetailRow
              label="Last Updated"
              value={formatDate(item.updatedAt)}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: height * 0.02,
    paddingHorizontal: width * 0.1,
  },
  errorText: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.05,
    gap: height * 0.022,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: width * 0.04,
    gap: height * 0.012,
  },
  profileCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.025,
  },
  // Absolute rakha hai taake avatar card ke beech mein hi rahe, neeche na khiske.
  profileActions: {
    position: 'absolute',
    top: height * 0.014,
    right: width * 0.035,
    flexDirection: 'row',
    gap: width * 0.02,
    zIndex: 1,
  },
  // Halka tinted circle — outline border se zyada saaf lagta hai is chhote size par.
  actionButton: {
    width: width * 0.072,
    height: width * 0.072,
    borderRadius: width * 0.036,
    backgroundColor: EDIT_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDanger: {
    backgroundColor: DANGER_TINT,
  },
  profileAvatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: colors.mantineBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    marginTop: height * 0.015,
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  profileSku: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  profileBadge: {
    marginTop: height * 0.014,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: height * 0.02,
    paddingTop: height * 0.018,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  profileStatValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  profileStatLabel: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    textAlign: 'center',
  },
  profileStatDivider: {
    width: 1,
    height: height * 0.035,
    backgroundColor: colors.border,
  },
  statusBadge: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
  },
  section: {
    gap: height * 0.01,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  descriptionText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
    lineHeight: fontSizes.sm * 1.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.012,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
});

export default ItemDetailScreen;
