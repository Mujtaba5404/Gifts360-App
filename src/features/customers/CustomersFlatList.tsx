import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { Customer, useCustomers } from '../../api/useCustomer';

type Nav = NativeStackNavigationProp<RootStackParamList>;


const formatAddress = (customer: Customer) => {
  const { address } = customer;
  if (!address) return '';
  return [address.line1, address.line2, address.city, address.state, address.country]
    .filter(Boolean)
    .join(', ');
};

const CustomersFlatList = () => {
  const navigation = useNavigation<Nav>();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCustomers({ page: 1, pageSize: 50 });

  const customers = data?.data ?? [];

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('EditCustomer', { customer: item })}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.title}
        </Text>
        {!!item.phone && (
          <Text style={styles.phone} numberOfLines={1}>
            {item.phone}
          </Text>
        )}
        {!!formatAddress(item) && (
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
            {formatAddress(item)}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={width * 0.05}
        color={colors.gray}
      />
    </TouchableOpacity>
  );

  const renderList = () => {
    if (isLoading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>Failed to load customers.</Text>
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
      );
    }

    if (customers.length === 0) {
      return <Text style={styles.emptyText}>No customers added yet.</Text>;
    }

    return (
      <FlatList
        data={customers}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Customers" isBack />

      <View style={styles.content}>
        <CustomButton
          text="Add Customer"
          onPress={() => navigation.navigate('CreateCustomer')}
          btnHeight={height * 0.06}
          btnWidth={width * 0.9}
          backgroundColor="transparent"
          textColor={colors.mantineBlue}
          borderColor={colors.mantineBlue}
          borderWidth={1}
          borderRadius={8}
          leftIcon={
            <Ionicons
              name="add"
              size={width * 0.06}
              color={colors.mantineBlue}
            />
          }
        />

        {renderList()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  centerState: {
    marginTop: height * 0.06,
    alignItems: 'center',
    gap: height * 0.02,
  },
  emptyText: {
    marginTop: height * 0.04,
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    marginTop: height * 0.035,
    paddingBottom: height * 0.04,
    gap: height * 0.015,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  phone: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  address: {
    marginTop: 4,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default CustomersFlatList;