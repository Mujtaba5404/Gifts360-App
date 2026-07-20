import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useEffect, useMemo, useState } from 'react';
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
import { useItems } from '../../api/useItems';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { getItemPicklistOptions } from './options';

type OpenDropdown = 'category' | 'unit' | null;

/** Form ki poori state — submit par screen ko isi shape mein values milti hain. */
export interface ItemFormValues {
  title: string;
  categoryId: string;
  unitId: string;
  description: string;
  /** Numbers form mein string rehte hain; screen submit par Number() karti hai. */
  sellingPrice: string;
  costPrice: string;
  reorderLevel: string;
  isPerishable: boolean;
}

export interface ItemFormProps {
  headerText: string;
  submitText: string;
  submittingText: string;

  /** Edit mode mein record load hone ke baad pre-fill ke liye. */
  initialValues?: Partial<ItemFormValues>;
  isLoadingInitial?: boolean;
  hasLoadError?: boolean;
  loadErrorText?: string;

  isPending: boolean;
  onSubmit: (values: ItemFormValues) => Promise<void> | void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  headerText,
  submitText,
  submittingText,
  initialValues,
  isLoadingInitial = false,
  hasLoadError = false,
  loadErrorText = 'Could not load this item.',
  isPending,
  onSubmit,
}) => {
  // Category/unit ke options mojooda items se aate hain (koi picklist API nahi hai).
  const { data: itemsData, isLoading: isLoadingOptions } = useItems({
    page: 1,
    pageSize: 500,
  });
  const items = useMemo(() => itemsData?.data ?? [], [itemsData]);

  const categoryOptions = useMemo(
    () => getItemPicklistOptions(items, 'category'),
    [items],
  );
  const unitOptions = useMemo(
    () => getItemPicklistOptions(items, 'unit'),
    [items],
  );

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [isPerishable, setIsPerishable] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  // Edit mode: record aane ke baad form ko ek dafa pre-fill karna hai.
  // NOTE: `false` se shuru hona zaroori hai — edit screen par pehle render mein
  // initialValues undefined hoti hai (record load ho raha hota hai), to
  // `!initialValues` flag ko true kar deta tha aur prefill kabhi chalta hi nahi tha.
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (!initialValues || isPrefilled) return;

    setTitle(initialValues.title ?? '');
    setCategoryId(initialValues.categoryId ?? '');
    setUnitId(initialValues.unitId ?? '');
    setDescription(initialValues.description ?? '');
    setSellingPrice(initialValues.sellingPrice ?? '');
    setCostPrice(initialValues.costPrice ?? '');
    setReorderLevel(initialValues.reorderLevel ?? '');
    setIsPerishable(!!initialValues.isPerishable);

    setIsPrefilled(true);
  }, [initialValues, isPrefilled]);

  const selectedCategoryLabel =
    categoryOptions.find(option => option.value === categoryId)?.label ?? '';
  const selectedUnitLabel =
    unitOptions.find(option => option.value === unitId)?.label ?? '';

  const dropdownOptions =
    openDropdown === 'category' ? categoryOptions : unitOptions;
  const selectedDropdownValue =
    openDropdown === 'category' ? categoryId : unitId;

  const handleSubmit = () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter an item title' });
      return;
    }

    onSubmit({
      title: title.trim(),
      categoryId,
      unitId,
      description: description.trim(),
      sellingPrice,
      costPrice,
      reorderLevel,
      isPerishable,
    });
  };

  // Edit mode: jab tak record load ho raha hai, form ke bajaye loader dikhao.
  if (isLoadingInitial) {
    return (
      <View style={styles.container}>
        <TopHeader text={headerText} isBack />
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      </View>
    );
  }

  if (hasLoadError) {
    return (
      <View style={styles.container}>
        <TopHeader text={headerText} isBack />
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{loadErrorText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopHeader text={headerText} isBack />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="e.g. Gift Box Large"
            placeholderTextColor={colors.gray}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category - picklist */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setOpenDropdown('category')}
          >
            <Text
              style={[
                styles.input,
                styles.flex1,
                !selectedCategoryLabel && styles.placeholderText,
              ]}
            >
              {selectedCategoryLabel || 'Select category'}
            </Text>
            {isLoadingOptions ? (
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

        {/* Unit - picklist */}
        <View style={styles.field}>
          <Text style={styles.label}>Unit</Text>
          <TouchableOpacity
            style={styles.inputRow}
            activeOpacity={0.7}
            onPress={() => setOpenDropdown('unit')}
          >
            <Text
              style={[
                styles.input,
                styles.flex1,
                !selectedUnitLabel && styles.placeholderText,
              ]}
            >
              {selectedUnitLabel || 'Select unit'}
            </Text>
            {isLoadingOptions ? (
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

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputBox, styles.textArea]}
            placeholder="Optional notes about this item"
            placeholderTextColor={colors.gray}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Selling price */}
        <View style={styles.field}>
          <Text style={styles.label}>Selling Price</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>Rs</Text>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="0"
              placeholderTextColor={colors.gray}
              value={sellingPrice}
              onChangeText={setSellingPrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Cost price */}
        <View style={styles.field}>
          <Text style={styles.label}>Cost Price</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>Rs</Text>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="0"
              placeholderTextColor={colors.gray}
              value={costPrice}
              onChangeText={setCostPrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Reorder level */}
        <View style={styles.field}>
          <Text style={styles.label}>Reorder Level</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            placeholder="0"
            placeholderTextColor={colors.gray}
            value={reorderLevel}
            onChangeText={setReorderLevel}
            keyboardType="numeric"
          />
        </View>

        {/* Perishable toggle */}
        <View style={[styles.field, styles.switchRow]}>
          <Text style={styles.label}>Perishable</Text>
          <Switch
            value={isPerishable}
            onValueChange={setIsPerishable}
            trackColor={{ true: colors.mantineBlue, false: colors.border }}
          />
        </View>

        <CustomButton
          text={isPending ? submittingText : submitText}
          onPress={handleSubmit}
          disabled={isPending}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={8}
        />
      </KeyboardAwareScrollView>

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
            {dropdownOptions.length === 0 ? (
              <Text style={styles.dropdownEmptyText}>
                No options available yet.
              </Text>
            ) : (
              dropdownOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => {
                    if (openDropdown === 'category') setCategoryId(option.value);
                    if (openDropdown === 'unit') setUnitId(option.value);
                    setOpenDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      option.value === selectedDropdownValue &&
                        styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === selectedDropdownValue && (
                    <Ionicons
                      name="checkmark"
                      size={width * 0.05}
                      color={colors.mantineBlue}
                    />
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
  currencyPrefix: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.gray,
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

export default ItemForm;
