import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  PurchaseOrderPaymentStatus,
  useCreatePurchaseOrder,
} from '../../api/usePurchaseOrders';
import { useVendors } from '../../api/useVendor';
import { Item, useItems } from '../../api/useItems';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import formatAmount from '../../utils/formatAmount';
import formatDate from '../../utils/formatDate';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface DropdownOption {
  label: string;
  value: string;
}

interface OrderItemRow {
  item?: Item;
  quantity: string;
  unitCost: string;
}

type OpenDropdown = 'vendor' | 'paymentStatus' | null;
type OpenDatePicker =
  | 'orderDate'
  | 'invoiceSubmissionDate'
  | 'paymentDate'
  | 'receivedOn'
  | null;

const PAYMENT_STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partially Paid', value: 'partial' },
  { label: 'Overdue', value: 'overdue' },
];

const formatDisplayDate = (d?: Date) =>
  d
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

const emptyRow = (): OrderItemRow => ({
  item: undefined,
  quantity: '1',
  unitCost: '0',
});

const CreatePurchaseOrder = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createPurchaseOrder, isPending } = useCreatePurchaseOrder();

  const { data: vendorsData, isLoading: isLoadingVendors } = useVendors({
    page: 1,
    pageSize: 100,
  });
  const { data: itemsData, isLoading: isLoadingItems } = useItems({
    page: 1,
    pageSize: 500,
  });

  const vendors = vendorsData?.data ?? [];
  const allItems = itemsData?.data ?? [];

  const [vendorId, setVendorId] = useState('');
  const [rows, setRows] = useState<OrderItemRow[]>([emptyRow()]);
  const [discountAmount, setDiscountAmount] = useState('0');
  const [taxAmount, setTaxAmount] = useState('0');
  const [serviceOrDeliveryFee, setServiceOrDeliveryFee] = useState('0');
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [invoiceSubmissionDate, setInvoiceSubmissionDate] = useState<
    Date | undefined
  >();
  const [paymentStatus, setPaymentStatus] =
    useState<PurchaseOrderPaymentStatus>('pending');
  const [paymentDate, setPaymentDate] = useState<Date | undefined>();
  const [isReceived, setIsReceived] = useState(false);
  const [receivedOn, setReceivedOn] = useState<Date | undefined>();
  const [notes, setNotes] = useState('');

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [itemPickerIndex, setItemPickerIndex] = useState<number | null>(null);
  const [datePickerFor, setDatePickerFor] = useState<OpenDatePicker>(null);

  // Amount wale inputs ke liye: focus mein raw value, blur pe formatAmount() se formatted value
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getDisplayValue = (key: string, raw: string) => {
    if (focusedField === key) return raw;
    const num = Number(raw);
    return raw !== '' && !isNaN(num) ? formatAmount(num) : raw;
  };

  const vendorOptions: DropdownOption[] = useMemo(
    () => vendors.map((v: any) => ({ label: v.title, value: v._id })),
    [vendors],
  );

  const vendorLabel =
    vendorOptions.find(v => v.value === vendorId)?.label ?? '';
  const paymentStatusLabel =
    PAYMENT_STATUS_OPTIONS.find(p => p.value === paymentStatus)?.label ?? '';

  const subtotal = useMemo(
    () =>
      rows.reduce((sum, row) => {
        const qty = Number(row.quantity) || 0;
        const cost = Number(row.unitCost) || 0;
        return sum + qty * cost;
      }, 0),
    [rows],
  );

  const grandTotal = useMemo(() => {
    const discount = Number(discountAmount) || 0;
    const tax = Number(taxAmount) || 0;
    const fee = Number(serviceOrDeliveryFee) || 0;
    return subtotal - discount + tax + fee;
  }, [subtotal, discountAmount, taxAmount, serviceOrDeliveryFee]);

  const updateRow = (index: number, patch: Partial<OrderItemRow>) => {
    setRows(prev =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => setRows(prev => [...prev, emptyRow()]);

  const removeRow = (index: number) => {
    setRows(prev =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };

  const onSelectItemForRow = (item: Item) => {
    if (itemPickerIndex === null) return;
    updateRow(itemPickerIndex, {
      item,
      unitCost: item.averageUnitCost ? String(item.averageUnitCost) : '0',
    });
    setItemPickerIndex(null);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const target = datePickerFor;
    setDatePickerFor(null);
    if (!selectedDate || !target) return;
    if (target === 'orderDate') setOrderDate(selectedDate);
    if (target === 'invoiceSubmissionDate')
      setInvoiceSubmissionDate(selectedDate);
    if (target === 'paymentDate') setPaymentDate(selectedDate);
    if (target === 'receivedOn') setReceivedOn(selectedDate);
  };

  const onSave = async () => {
    if (!vendorId) {
      Toast.show({ type: 'error', text1: 'Select a vendor' });
      return;
    }

    const validRows = rows.filter(r => r.item);
    if (validRows.length === 0) {
      Toast.show({ type: 'error', text1: 'Add at least one item' });
      return;
    }

    for (const row of validRows) {
      const qty = Number(row.quantity);
      const cost = Number(row.unitCost);
      if (!qty || qty <= 0) {
        Toast.show({
          type: 'error',
          text1: `Enter a valid quantity for ${row.item?.title}`,
        });
        return;
      }
      if (isNaN(cost) || cost < 0) {
        Toast.show({
          type: 'error',
          text1: `Enter a valid unit cost for ${row.item?.title}`,
        });
        return;
      }
    }

    try {
      const response = await createPurchaseOrder({
        vendor: vendorId,
        items: validRows.map(row => ({
          item: row.item!._id,
          quantity: Number(row.quantity),
          unitCost: Number(row.unitCost),
        })),
        discountAmount: Number(discountAmount) || 0,
        taxAmount: Number(taxAmount) || 0,
        serviceOrDeliveryFee: Number(serviceOrDeliveryFee) || 0,
        orderDate: orderDate.toISOString(),
        invoiceSubmissionDate: invoiceSubmissionDate?.toISOString(),
        paymentStatus,
        paymentDate: paymentDate?.toISOString(),
        isReceived,
        receivedOn: receivedOn?.toISOString(),
        notes: notes.trim(),
      });

      await queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Purchase order created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not create purchase order',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  const currentDropdownOptions =
    openDropdown === 'vendor' ? vendorOptions : PAYMENT_STATUS_OPTIONS;

  return (
    <View style={styles.container}>
      <TopHeader text="Add Purchase Order" isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
        {/* Vendor */}
        <View style={styles.field}>
          <Text style={styles.label}>Vendor</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setOpenDropdown('vendor')}
          >
            <Text
              style={[
                styles.input,
                styles.flex1,
                !vendorLabel && styles.placeholderText,
              ]}
            >
              {vendorLabel || 'Select vendor'}
            </Text>
            {isLoadingVendors ? (
              <ActivityIndicator size="small" color={colors.gray} />
            ) : (
              <Ionicons
                name="chevron-down"
                size={width * 0.05}
                color={colors.gray}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Order date */}
        <View style={styles.field}>
          <Text style={styles.label}>Order Date</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setDatePickerFor('orderDate')}
          >
            <Text style={styles.input}>{formatDisplayDate(orderDate)}</Text>
            <Ionicons
              name="calendar-outline"
              size={width * 0.05}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Items */}
        <View style={styles.field}>
          <View style={styles.itemsHeader}>
            <Text style={styles.label}>Items</Text>
            <TouchableOpacity
              onPress={addRow}
              style={styles.addRowBtn}
              hitSlop={8}
            >
              <Ionicons
                name="add-circle"
                size={width * 0.055}
                color={colors.mantineBlue}
              />
              <Text style={styles.addRowText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {rows.map((row, index) => (
            <View key={index} style={styles.itemRowCard}>
              <TouchableOpacity
                style={styles.inputRow}
                activeOpacity={0.7}
                onPress={() => setItemPickerIndex(index)}
              >
                <Text
                  style={[
                    styles.input,
                    styles.flex1,
                    !row.item && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {row.item ? row.item.title : 'Select item'}
                </Text>
                {isLoadingItems ? (
                  <ActivityIndicator size="small" color={colors.gray} />
                ) : (
                  <Ionicons
                    name="chevron-down"
                    size={width * 0.05}
                    color={colors.gray}
                  />
                )}
              </TouchableOpacity>

              <View style={styles.itemRowBottom}>
                <View style={styles.itemRowField}>
                  <Text style={styles.smallLabel}>Qty</Text>
                  <TextInput
                    style={[styles.input, styles.inputBox]}
                    keyboardType="numeric"
                    value={row.quantity}
                    onChangeText={v => updateRow(index, { quantity: v })}
                  />
                </View>

                <View style={styles.itemRowField}>
                  <Text style={styles.smallLabel}>Unit Cost</Text>
                  <TextInput
                    style={[styles.input, styles.inputBox]}
                    keyboardType="numeric"
                    value={getDisplayValue(`unitCost-${index}`, row.unitCost)}
                    onFocus={() => setFocusedField(`unitCost-${index}`)}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={v => updateRow(index, { unitCost: v })}
                  />
                </View>

                <TouchableOpacity
                  style={styles.removeRowBtn}
                  onPress={() => removeRow(index)}
                  disabled={rows.length === 1}
                  hitSlop={8}
                >
                  <Ionicons
                    name="trash-outline"
                    size={width * 0.05}
                    color={rows.length === 1 ? colors.lightGray : '#C2255C'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Discount / Tax / Fee */}
        <View style={styles.field}>
          <Text style={styles.label}>Discount Amount</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="0"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
            value={getDisplayValue('discount', discountAmount)}
            onFocus={() => setFocusedField('discount')}
            onBlur={() => setFocusedField(null)}
            onChangeText={setDiscountAmount}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tax Amount</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="0"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
            value={getDisplayValue('tax', taxAmount)}
            onFocus={() => setFocusedField('tax')}
            onBlur={() => setFocusedField(null)}
            onChangeText={setTaxAmount}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Service / Delivery Fee</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="0"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
            value={getDisplayValue('fee', serviceOrDeliveryFee)}
            onFocus={() => setFocusedField('fee')}
            onBlur={() => setFocusedField(null)}
            onChangeText={setServiceOrDeliveryFee}
          />
        </View>

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatAmount(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotalLabel]}>
              Grand Total
            </Text>
            <Text style={[styles.totalValue, styles.grandTotalValue]}>
              {formatAmount(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Invoice submission date */}
        <View style={styles.field}>
          <Text style={styles.label}>Invoice Submission Date</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setDatePickerFor('invoiceSubmissionDate')}
          >
            <Text
              style={[
                styles.input,
                !invoiceSubmissionDate && styles.placeholderText,
              ]}
            >
              {invoiceSubmissionDate
                ? formatDisplayDate(invoiceSubmissionDate)
                : 'Select date'}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={width * 0.05}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Payment status */}
        <View style={styles.field}>
          <Text style={styles.label}>Payment Status</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setOpenDropdown('paymentStatus')}
          >
            <Text style={styles.input}>{paymentStatusLabel}</Text>
            <Ionicons
              name="chevron-down"
              size={width * 0.05}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Payment date */}
        <View style={styles.field}>
          <Text style={styles.label}>Payment Date</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setDatePickerFor('paymentDate')}
          >
            <Text
              style={[styles.input, !paymentDate && styles.placeholderText]}
            >
              {paymentDate ? formatDate(paymentDate) : 'Select date'}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={width * 0.05}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Received toggle */}
        <View style={[styles.field, styles.switchRow]}>
          <Text style={styles.label}>Received</Text>
          <Switch
            value={isReceived}
            onValueChange={v => {
              setIsReceived(v);
              if (!v) setReceivedOn(undefined);
            }}
            trackColor={{ true: colors.mantineBlue, false: colors.border }}
          />
        </View>

        {isReceived && (
          <View style={styles.field}>
            <Text style={styles.label}>Received On</Text>
            <TouchableOpacity
              style={styles.inputRow}
              activeOpacity={0.7}
              onPress={() => setDatePickerFor('receivedOn')}
            >
              <Text
                style={[styles.input, !receivedOn && styles.placeholderText]}
              >
                {receivedOn ? formatDisplayDate(receivedOn) : 'Select date'}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={width * 0.05}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.inputBox, styles.textArea]}
            placeholder="Optional notes"
            placeholderTextColor={colors.gray}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <CustomButton
          text={isPending ? 'Saving...' : 'Save Purchase Order'}
          onPress={onSave}
          disabled={isPending}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />
      </KeyboardAwareScrollView>

      {/* Date picker */}
      {datePickerFor && (
        <DateTimePicker
          value={
            datePickerFor === 'orderDate'
              ? orderDate
              : datePickerFor === 'invoiceSubmissionDate'
              ? invoiceSubmissionDate ?? new Date()
              : datePickerFor === 'paymentDate'
              ? paymentDate ?? new Date()
              : receivedOn ?? new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {/* Vendor / Payment status dropdown */}
      <Modal
        visible={openDropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenDropdown(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpenDropdown(null)}
        >
          <ScrollView
            style={styles.dropdownBox}
            contentContainerStyle={styles.dropdownContent}
            keyboardShouldPersistTaps="handled"
          >
            {currentDropdownOptions.length === 0 ? (
              <Text style={styles.dropdownEmptyText}>
                No options available.
              </Text>
            ) : (
              currentDropdownOptions.map(option => {
                const selected =
                  openDropdown === 'vendor'
                    ? option.value === vendorId
                    : option.value === paymentStatus;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.dropdownOption}
                    onPress={() => {
                      if (openDropdown === 'vendor') setVendorId(option.value);
                      if (openDropdown === 'paymentStatus')
                        setPaymentStatus(option.value);
                      setOpenDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        selected && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={width * 0.05}
                        color={colors.mantineBlue}
                      />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </TouchableOpacity>
      </Modal>

      {/* Item picker */}
      <Modal
        visible={itemPickerIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setItemPickerIndex(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setItemPickerIndex(null)}
        >
          <ScrollView
            style={styles.dropdownBox}
            contentContainerStyle={styles.dropdownContent}
            keyboardShouldPersistTaps="handled"
          >
            {allItems.length === 0 ? (
              <Text style={styles.dropdownEmptyText}>No items available.</Text>
            ) : (
              allItems.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.dropdownOption}
                  onPress={() => onSelectItemForRow(item)}
                >
                  <Text style={styles.dropdownOptionText} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!!item.sku && (
                    <Text style={styles.dropdownOptionSub}>{item.sku}</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
    gap: height * 0.022,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  smallLabel: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    marginBottom: 4,
  },
  input: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
    padding: 0,
  },
  placeholderText: {
    color: colors.gray,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.016,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: width * 0.02,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.016,
  },
  flex1: {
    flex: 1,
  },
  textArea: {
    minHeight: height * 0.1,
    textAlignVertical: 'top',
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addRowText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  itemRowCard: {
    marginTop: height * 0.012,
    padding: width * 0.03,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    gap: height * 0.01,
  },
  itemRowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: width * 0.025,
  },
  itemRowField: {
    flex: 1,
  },
  removeRowBtn: {
    padding: 6,
  },
  totalsBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: width * 0.04,
    gap: height * 0.01,
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
  grandTotalLabel: {
    color: colors.black,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  grandTotalValue: {
    color: colors.mantineBlue,
    fontSize: fontSizes.sm2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
  },
  dropdownBox: {
    flexGrow: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: height * 0.5,
  },
  dropdownContent: {
    paddingVertical: height * 0.01,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
  },
  dropdownOptionText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  dropdownOptionSub: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  dropdownOptionTextSelected: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  dropdownEmptyText: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default CreatePurchaseOrder;
