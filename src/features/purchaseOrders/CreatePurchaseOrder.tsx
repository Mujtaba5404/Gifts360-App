import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useCreatePurchaseOrder } from '../../api/usePurchaseOrders';
import { useVendors } from '../../api/useVendor';
import { RootStackParamList } from '../../navigation/types';
import OrderForm from '../orders/OrderForm';
import { DropdownOption, OrderFormValues } from '../orders/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CreatePurchaseOrder = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createPurchaseOrder, isPending } = useCreatePurchaseOrder();

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

  const onSubmit = async (values: OrderFormValues) => {
    try {
      const response = await createPurchaseOrder({
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

  return (
    <OrderForm
      headerText="Add Purchase Order"
      submitText="Save Purchase Order"
      submittingText="Saving..."
      partyLabel="Vendor"
      partyPlaceholder="Select vendor"
      partyOptions={vendorOptions}
      isLoadingParty={isLoadingVendors}
      unitLabel="Unit Cost"
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default CreatePurchaseOrder;
