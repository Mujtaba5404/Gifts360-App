import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useItem, useUpdateItem } from '../../api/useItems';
import { RootStackParamList } from '../../navigation/types';
import ItemForm, { ItemFormValues } from './ItemForm';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditItemRoute = RouteProp<RootStackParamList, 'EditItem'>;

const toNumber = (value: string) => {
  const parsed = Number(value.trim());
  return isNaN(parsed) ? 0 : parsed;
};

const EditItem = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditItemRoute>();
  const queryClient = useQueryClient();

  const itemId = route.params?.itemId;

  const { updateItem, isPending } = useUpdateItem();
  const {
    data: itemData,
    isLoading: isLoadingItem,
    isError: isItemError,
  } = useItem(itemId);

  const initialValues = useMemo(() => {
    if (!itemData) return undefined;

    const item: any = (itemData as any).data ?? (itemData as any);

    return {
      title: item.title ?? '',
      categoryId: item.category?._id ?? item.category ?? '',
      unitId: item.unit?._id ?? item.unit ?? '',
      description: item.description ?? '',
      sellingPrice: String(item.sellingPrice ?? ''),
      costPrice: String(item.costPrice ?? ''),
      reorderLevel: String(item.reorderLevel ?? ''),
      isPerishable: !!item.isPerishable,
    };
  }, [itemData]);

  const onSubmit = async (values: ItemFormValues) => {
    if (!itemId) {
      Toast.show({ type: 'error', text1: 'Missing item id' });
      return;
    }

    try {
      const res = await updateItem({
        id: itemId,
        title: values.title,
        category: values.categoryId || undefined,
        unit: values.unitId || undefined,
        description: values.description,
        sellingPrice: toNumber(values.sellingPrice),
        costPrice: toNumber(values.costPrice),
        reorderLevel: toNumber(values.reorderLevel),
        isPerishable: values.isPerishable,
      });

      await queryClient.invalidateQueries({ queryKey: ['items'] });
      await queryClient.invalidateQueries({ queryKey: ['item', itemId] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'Item updated successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not update item',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <ItemForm
      headerText="Edit Item"
      submitText="Update Item"
      submittingText="Updating..."
      initialValues={initialValues}
      isLoadingInitial={isLoadingItem || !initialValues}
      hasLoadError={isItemError}
      loadErrorText="Could not load this item."
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default EditItem;
