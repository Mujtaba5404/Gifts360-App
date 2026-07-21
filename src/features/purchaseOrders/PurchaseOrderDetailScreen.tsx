import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
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
import {
  PurchaseOrder,
  useDeletePurchaseOrder,
  usePurchaseOrder,
} from '../../api/usePurchaseOrders';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import capitalizeLetters from '../../utils/capitalizeLetters';
import formatAmount from '../../utils/formatAmount';
import formatDate from '../../utils/formatDate';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DetailRoute = RouteProp<{ PurchaseOrderDetail: { orderId: string } }, 'PurchaseOrderDetail'>;

const STATUS_META: Record<PurchaseOrder['paymentStatus'],{ label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#B54708', bg: '#FFF4E5' },
  paid: { label: 'Paid', color: '#2B8A3E', bg: '#E8F7EC' },
  partial: { label: 'Partial', color: '#0C8599', bg: '#E3F8FA' },
  overdue: { label: 'Overdue', color: '#C2255C', bg: '#FDECF1' },
};

const DANGER_COLOR = '#C2255C';
const DANGER_TINT = '#FDECF1';
const EDIT_TINT = '#EDF0FE';

const DetailRow = ({label, value, isLast}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const PurchaseOrderDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const queryClient = useQueryClient();
  const { orderId } = route.params;

  const { data, isLoading, isError, refetch, isRefetching } =
    usePurchaseOrder(orderId);
  const { deletePurchaseOrder, isPending: isDeleting } =
    useDeletePurchaseOrder();

  const order = data;
  const items = order?.items ?? [];

  const onEdit = () => navigation.navigate('EditPurchaseOrder', { orderId });

  const onDelete = () => {
    Alert.alert(
      'Delete Purchase Order',
      'Are you sure you want to delete this purchase order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deletePurchaseOrder({ id: orderId });
              await queryClient.invalidateQueries({
                queryKey: ['purchaseOrders'],
              });

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: res?.message || 'Purchase order deleted successfully',
              });

              navigation.goBack();
            } catch (err: any) {
              Toast.show({
                type: 'error',
                text1: 'Could not delete purchase order',
                text2:
                  err?.message || 'Something went wrong. Please try again.',
              });
            }
          },
        },
      ],
    );
  };
  const statusMeta = order ? STATUS_META[order.paymentStatus] : undefined;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopHeader text="Purchase Order" isBack />
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={styles.container}>
        <TopHeader text="Purchase Order" isBack />
        <View style={styles.centerFill}>
          <Ionicons
            name="cloud-offline-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.errorText}>
            Could not load this purchase order.
          </Text>
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

  return (
    <View style={styles.container}>
      <TopHeader text={order.poNumber} isBack />

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
              name="document-text-outline"
              size={width * 0.1}
              color={colors.white}
            />
          </View>

          <Text style={styles.profilePoNumber}>{order.poNumber}</Text>
          <Text style={styles.profileVendor} numberOfLines={1}>
            {capitalizeLetters(order.vendor?.title ?? 'Unknown vendor')}
          </Text>

          {statusMeta && (
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
          )}

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatAmount(order.grandTotal)}
              </Text>
              <Text style={styles.profileStatLabel}>Grand Total</Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{items.length}</Text>
              <Text style={styles.profileStatLabel}>
                {items.length === 1 ? 'Item' : 'Items'}
              </Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatDate(order.orderDate)}
              </Text>
              <Text style={styles.profileStatLabel}>Order Date</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendor</Text>
          <View style={styles.card}>
            <DetailRow
              label="Name"
              value={capitalizeLetters(order.vendor?.title ?? '-')}
            />
            <DetailRow label="Email" value={order.vendor?.email || '-'} />
            <DetailRow label="Phone" value={(order.vendor?.phone || '-')} />
            <DetailRow
              label="Address"
              value={capitalizeLetters(order.vendor?.compiledAddress || '-')}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({items.length})</Text>

          {items.map((row, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.flex1}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {capitalizeLetters(row.item?.title ?? row.title)}
                </Text>
                {!!(row.item?.sku ?? row.sku) && (
                  <Text style={styles.itemSku}>
                    {row.item?.sku ?? row.sku}
                  </Text>
                )}
                <Text style={styles.itemMeta}>
                  {row.quantity} x {formatAmount(row.unitCost)}
                </Text>
              </View>
              <Text style={styles.itemLineTotal}>
                {formatAmount(row.lineTotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Totals</Text>
          <View style={styles.card}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatAmount(order.subtotal)}
              </Text>
            </View>
            {order.discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>
                  -{formatAmount(order.discountAmount)}
                </Text>
              </View>
            )}
            {order.taxAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>
                  {formatAmount(order.taxAmount)}
                </Text>
              </View>
            )}
            {order.serviceOrDeliveryFee > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Service / Delivery Fee</Text>
                <Text style={styles.totalValue}>
                  {formatAmount(order.serviceOrDeliveryFee)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, styles.grandTotalLabel]}>
                Grand Total
              </Text>
              <Text style={[styles.totalValue, styles.grandTotalValue]}>
                {formatAmount(order.grandTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.card}>
            <DetailRow label="Order Date" value={formatDate(order.orderDate)} />
            <DetailRow
              label="Invoice Submission Date"
              value={
                order.invoiceSubmissionDate
                  ? formatDate(order.invoiceSubmissionDate)
                  : '-'
              }
            />
            <DetailRow label="Status" value={statusMeta?.label ?? '-'} />
            <DetailRow
              label="Payment Date"
              value={order.paymentDate ? formatDate(order.paymentDate) : '-'}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receiving</Text>
          <View style={styles.card}>
            <DetailRow label="Received" value={order.isReceived ? 'Yes' : 'No'} />
            <DetailRow
              label="Received On"
              value={
                order.isReceived && order.receivedOn
                  ? formatDate(order.receivedOn)
                  : '-'
              }
              isLast
            />
          </View>
        </View>

        {/* Meta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.card}>
            <DetailRow
              label="Created By"
              value={capitalizeLetters(order.createdBy?.name || '-')}
            />
            <DetailRow
              label="Created On"
              value={formatDate(order.createdAt)}
            />
            <DetailRow
              label="Last Updated"
              value={formatDate(order.updatedAt)}
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
  flex1: {
    flex: 1,
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
  profileActions: {
    position: 'absolute',
    top: height * 0.014,
    right: width * 0.035,
    flexDirection: 'row',
    gap: width * 0.02,
    zIndex: 1,
  },
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
  profilePoNumber: {
    marginTop: height * 0.015,
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  profileVendor: {
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: width * 0.03,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: width * 0.035,
    marginTop: height * 0.01,
  },
  itemTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  itemSku: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    marginTop: 2,
  },
  itemMeta: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    marginTop: 4,
  },
  itemLineTotal: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  totalValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.006,
  },
  grandTotalLabel: {
    color: colors.black,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  grandTotalValue: {
    color: colors.mantineBlue,
    fontSize: fontSizes.sm2,
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

export default PurchaseOrderDetailScreen;