import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useCustomers } from '../../api/useCustomer';
import {
  useSalesOrder,
  useSalesOrders,
  useUpdateSalesOrder,
} from '../../api/useSalesOrders';
import { RootStackParamList } from '../../navigation/types';
import OrderForm from '../orders/OrderForm';
import {
  DropdownOption,
  OrderFormExtraSelect,
  OrderFormValues,
  OrderItemRow,
} from '../orders/types';
import {
  ORDER_STATUS_OPTIONS,
  getPicklistOptions,
  getSalesPersonOptions,
} from './options';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditSORoute = RouteProp<RootStackParamList, 'EditSalesOrder'>;

const EditSalesOrder = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditSORoute>();
  const queryClient = useQueryClient();

  const orderId = route.params?.orderId;

  const { updateSalesOrder, isPending } = useUpdateSalesOrder();
  const {
    data: salesOrderData,
    isLoading: isLoadingOrder,
    isError: isOrderError,
  } = useSalesOrder(orderId);

  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    pageSize: 100,
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useSalesOrders({
    page: 1,
    pageSize: 100,
  });

  const customerOptions: DropdownOption[] = useMemo(
    () =>
      (customersData?.data ?? []).map(customer => ({
        label: customer.title,
        value: customer._id,
      })),
    [customersData],
  );

  const extraSelects: OrderFormExtraSelect[] = useMemo(() => {
    const orders = ordersData?.data ?? [];
    return [
      {
        key: 'orderStatus',
        label: 'Order Status',
        placeholder: 'Select order status',
        options: ORDER_STATUS_OPTIONS,
        required: true,
      },
      {
        key: 'paymentMode',
        label: 'Payment Mode',
        placeholder: 'Select payment mode',
        options: getPicklistOptions(orders, 'paymentMode'),
        isLoading: isLoadingOrders,
      },
      {
        key: 'occasion',
        label: 'Occasion',
        placeholder: 'Select occasion',
        options: getPicklistOptions(orders, 'occasion'),
        isLoading: isLoadingOrders,
      },
      {
        key: 'salesPerson',
        label: 'Sales Person',
        placeholder: 'Select sales person',
        options: getSalesPersonOptions(orders),
        isLoading: isLoadingOrders,
      },
    ];
  }, [ordersData, isLoadingOrders]);

  const initialValues = useMemo(() => {
    if (!salesOrderData) return undefined;

    const so: any = (salesOrderData as any).data ?? (salesOrderData as any);

    const rows: OrderItemRow[] = (so.items ?? []).map((line: any) => ({
      item: line.item,
      quantity: String(line.quantity ?? '1'),
      unitCost: String(line.unitPrice ?? '0'),
    }));

    return {
      partyId: so.customer?._id ?? so.customer ?? '',
      rows,
      discountAmount: String(so.discountAmount ?? '0'),
      taxAmount: String(so.taxAmount ?? '0'),
      serviceOrDeliveryFee: String(so.serviceOrDeliveryFee ?? '0'),
      orderDate: so.orderDate ? new Date(so.orderDate) : new Date(),
      paymentStatus: so.paymentStatus ?? 'pending',
      paymentDate: so.paymentDate ? new Date(so.paymentDate) : undefined,
      notes: so.notes ?? '',
      extras: {
        orderStatus: so.orderStatus ?? 'pending',
        paymentMode: so.paymentMode?._id ?? so.paymentMode ?? '',
        occasion: so.occasion?._id ?? so.occasion ?? '',
        salesPerson: so.salesPerson?._id ?? so.salesPerson ?? '',
      },
    };
  }, [salesOrderData]);

  const onSubmit = async (values: OrderFormValues) => {
    if (!orderId) {
      Toast.show({ type: 'error', text1: 'Missing sales order id' });
      return;
    }

    try {
      const response = await updateSalesOrder({
        id: orderId,
        customer: values.partyId,
        items: values.rows.map(row => ({
          item: row.item!._id,
          quantity: Number(row.quantity),
          unitPrice: Number(row.unitCost),
        })),
        discountAmount: Number(values.discountAmount) || 0,
        taxAmount: Number(values.taxAmount) || 0,
        serviceOrDeliveryFee: Number(values.serviceOrDeliveryFee) || 0,
        orderDate: values.orderDate.toISOString(),
        orderStatus: (values.extras.orderStatus || 'pending') as any,
        paymentStatus: values.paymentStatus as any,
        paymentMode: values.extras.paymentMode || undefined,
        paymentDate: values.paymentDate?.toISOString(),
        occasion: values.extras.occasion || undefined,
        salesPerson: values.extras.salesPerson || undefined,
        notes: values.notes.trim(),
      });

      await queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      await queryClient.invalidateQueries({ queryKey: ['salesOrder', orderId] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Sales order updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not update sales order',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <OrderForm
      headerText="Edit Sales Order"
      submitText="Update Sales Order"
      submittingText="Updating..."
      partyLabel="Customer"
      partyPlaceholder="Select customer"
      partyOptions={customerOptions}
      isLoadingParty={isLoadingCustomers}
      unitLabel="Unit Price"
      showInvoiceSubmissionDate={false}
      showReceived={false}
      extraSelects={extraSelects}
      initialValues={initialValues}
      isLoadingInitial={isLoadingOrder || !initialValues}
      hasLoadError={isOrderError}
      loadErrorText="Could not load this sales order."
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default EditSalesOrder;
