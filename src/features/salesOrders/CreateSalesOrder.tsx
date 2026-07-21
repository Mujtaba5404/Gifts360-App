import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useCustomers } from '../../api/useCustomer';
import { useCreateSalesOrder, useSalesOrders } from '../../api/useSalesOrders';
import { RootStackParamList } from '../../navigation/types';
import OrderForm from '../orders/OrderForm';
import {
  DropdownOption,
  OrderFormExtraSelect,
  OrderFormValues,
} from '../orders/types';
import {
  ORDER_STATUS_OPTIONS,
  getPicklistOptions,
  getSalesPersonOptions,
} from './options';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CreateSalesOrder = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createSalesOrder, isPending } = useCreateSalesOrder();

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

  const onSubmit = async (values: OrderFormValues) => {
    try {
      const response = await createSalesOrder({
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

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response?.message || 'Sales order created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not create sales order',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <OrderForm
      headerText="Add Sales Order"
      submitText="Save Sales Order"
      submittingText="Saving..."
      partyLabel="Customer"
      partyPlaceholder="Select customer"
      partyOptions={customerOptions}
      isLoadingParty={isLoadingCustomers}
      unitLabel="Unit Price"
      showInvoiceSubmissionDate={false}
      showReceived={false}
      extraSelects={extraSelects}
      initialValues={{ extras: { orderStatus: 'pending' } }}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default CreateSalesOrder;
