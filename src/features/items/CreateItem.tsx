import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useCreateItem } from '../../api/useItems';
import { RootStackParamList } from '../../navigation/types';
import ItemForm, { ItemFormValues } from './ItemForm';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Khali string ko 0 maan lo — backend numbers expect karta hai. */
const toNumber = (value: string) => {
  const parsed = Number(value.trim());
  return isNaN(parsed) ? 0 : parsed;
};

const CreateItem = () => {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { createItem, isPending } = useCreateItem();

  const onSubmit = async (values: ItemFormValues) => {
    try {
      const res = await createItem({
        title: values.title,
        ...(values.categoryId && { category: values.categoryId }),
        ...(values.unitId && { unit: values.unitId }),
        ...(values.description && { description: values.description }),
        sellingPrice: toNumber(values.sellingPrice),
        costPrice: toNumber(values.costPrice),
        reorderLevel: toNumber(values.reorderLevel),
        isPerishable: values.isPerishable,
      });

      await queryClient.invalidateQueries({ queryKey: ['items'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res?.message || 'Item created successfully',
      });

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not save item',
        text2: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <ItemForm
      headerText="Add Item"
      submitText="Save Item"
      submittingText="Saving..."
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default CreateItem;
