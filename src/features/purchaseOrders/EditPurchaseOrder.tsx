import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import {
  usePurchaseOrder,
  useUpdatePurchaseOrder,
} from '../../api/usePurchaseOrders';
import { useVendors } from '../../api/useVendor';
import { RootStackParamList } from '../../navigation/types';
import OrderForm from '../orders/OrderForm';
import { DropdownOption, OrderFormValues, OrderItemRow } from '../orders/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditPORoute = RouteProp<RootStackParamList, 'EditPurchaseOrder'>;

const EditPurchaseOrder = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditPORoute>();
  const queryClient = useQueryClient();

  const orderId = route.params?.orderId;

  const { updatePurchaseOrder, isPending } = useUpdatePurchaseOrder();
  const {
    data: purchaseOrderData,
    isLoading: isLoadingOrder,
    isError: isOrderError,
  } = usePurchaseOrder(orderId);

  const { data: vendorsData, isLoading: isLoadingVendors } = useVendors({
    page: 1,
    pageSize: 100,
  });

  const vendorOptions: DropdownOption[] = useMemo(
    () =>
      (vendorsData?.data ?? []).map(vendor => ({
        label: vendor.title,
        value: vendor._id,
      })),
    [vendorsData],
  );

  const initialValues = useMemo(() => {
    if (!purchaseOrderData) return undefined;

    const po: any =
      (purchaseOrderData as any).data ?? (purchaseOrderData as any);

    const rows: OrderItemRow[] = (po.items ?? []).map((line: any) => ({
      item: line.item,
      quantity: String(line.quantity ?? '1'),
      unitCost: String(line.unitCost ?? '0'),
    }));

    return {
      partyId: po.vendor?._id ?? po.vendor ?? '',
      rows,
      discountAmount: String(po.discountAmount ?? '0'),
      taxAmount: String(po.taxAmount ?? '0'),
      serviceOrDeliveryFee: String(po.serviceOrDeliveryFee ?? '0'),
      orderDate: po.orderDate ? new Date(po.orderDate) : new Date(),
      invoiceSubmissionDate: po.invoiceSubmissionDate
        ? new Date(po.invoiceSubmissionDate)
        : undefined,
      paymentStatus: po.paymentStatus ?? 'pending',
      paymentDate: po.paymentDate ? new Date(po.paymentDate) : undefined,
      isReceived: !!po.isReceived,
      receivedOn: po.receivedOn ? new Date(po.receivedOn) : undefined,
      notes: po.notes ?? '',
    };
  }, [purchaseOrderData]);

  const onSubmit = async (values: OrderFormValues) => {
    if (!orderId) {
      Toast.show({ type: 'error', text1: 'Missing purchase order id' });
      return;
    }

    try {
      const response = await updatePurchaseOrder({
        id: orderId,
        vendor: values.partyId,
        items: values.rows.map(row => ({
          item: row.item!._id,
          quantity: Number(row.quantity),
          unitCost: Number(row.unitCost),
        })),
        discountAmount: Number(values.discountAmount) || 0,
        taxAmount: Number(values.taxAmount) || 0,
        serviceOrDeliveryFee: Number(values.serviceOrDeliveryFee) || 0,
        orderDate: values.orderDate.toISOString(),
        invoiceSubmissionDate: values.invoiceSubmissionDate?.toISOString(),
        paymentStatus: values.paymentStatus as any,
        paymentDate: values.paymentDate?.toISOString(),
        isReceived: values.isReceived,
        receivedOn: values.receivedOn?.toISOString(),
        notes: values.notes.trim(),
      });

      await queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      await queryClient.invalidateQueries({
        queryKey: ['purchaseOrder', orderId],
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Purchase order updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not update purchase order',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <OrderForm
      headerText="Edit Purchase Order"
      submitText="Update Purchase Order"
      submittingText="Updating..."
      partyLabel="Vendor"
      partyPlaceholder="Select vendor"
      partyOptions={vendorOptions}
      isLoadingParty={isLoadingVendors}
      unitLabel="Unit Cost"
      initialValues={initialValues}
      isLoadingInitial={isLoadingOrder || !initialValues}
      hasLoadError={isOrderError}
      loadErrorText="Could not load this purchase order."
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default EditPurchaseOrder;
