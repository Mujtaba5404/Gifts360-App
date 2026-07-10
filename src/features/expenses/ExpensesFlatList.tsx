import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
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

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Expense {
  id: string;
  date: string;
  payee: string;
  paymentMode: string;
  description: string;
  expense: string;
  amount: string;
}

const DUMMY_DATA: Expense[] = [
  {
    id: '1',
    date: '01 Jul 2026',
    payee: 'Ali Traders',
    paymentMode: 'Cash',
    description: 'Office supplies',
    expense: 'Stationery',
    amount: '7,50000',
  },
  {
    id: '2',
    date: '03 Jul 2026',
    payee: 'K-Electric',
    paymentMode: 'Bank Transfer',
    description: 'Monthly electricity bill',
    expense: 'Utilities',
    amount: '8,900',
  },
  {
    id: '3',
    date: '05 Jul 2026',
    payee: 'Careem',
    paymentMode: 'Card',
    description: 'Client meeting travel',
    expense: 'Travel',
    amount: '650',
  },
];

const ExpensesFlatList = () => {
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('EditExpenses', { expense: item })}
    >
      <View style={styles.info}>
        <Text style={styles.payee} numberOfLines={1}>
          {item.payee}
        </Text>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.date} · {item.paymentMode}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.amount}>Rs {item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopHeader text="Expenses" isBack />

      <View style={styles.content}>
        <CustomButton
          text="Add Expense"
          onPress={() => navigation.navigate('CreateExpenses')}
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

        {DUMMY_DATA.length === 0 ? (
          <Text style={styles.emptyText}>No expenses added yet.</Text>
        ) : (
          <FlatList
            data={DUMMY_DATA}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
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
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: colors.mantineBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  payee: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  description: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  meta: {
    marginTop: 4,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
});

export default ExpensesFlatList;

// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { Ionicons } from '@react-native-vector-icons/ionicons';
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { fontFamily } from '../../assets/Fonts';
// import { CustomButton, TopHeader } from '../../components';
// import { RootStackParamList } from '../../navigation/types';
// import { height, width } from '../../utils';
// import { colors } from '../../utils/colors';
// import { fontSizes } from '../../utils/fontSizes';
// import { useExpenses, Expense } from '../../api/useExpenses';

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// const ExpensesFlatList = () => {
//   const navigation = useNavigation<Nav>();
//   const { data, isLoading, isError, refetch, isRefetching } = useExpenses({
//     page: 1,
//     pageSize: 100,
//   });

//   const expenses = data?.data ?? [];

//   const formatDate = (iso: string) =>
//     new Date(iso).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });

//   const renderItem = ({ item }: { item: Expense }) => (
//     <TouchableOpacity style={styles.card} activeOpacity={0.6}>
//       <View style={styles.info}>
//         <Text style={styles.payee} numberOfLines={1}>
//           {item.payee}
//         </Text>
//         <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
//           {item.description}
//         </Text>
//         <Text style={styles.meta} numberOfLines={1}>
//           {formatDate(item.date)} · {item.paymentMode ?? '-'}
//         </Text>
//       </View>

//       <View style={styles.right}>
//         <Text style={styles.amount}>Rs {item.amount.toLocaleString()}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <TopHeader text="Expenses" isBack />

//       <View style={styles.content}>
//         <CustomButton
//           text="Add Expense"
//           onPress={() => navigation.navigate('CreateExpenses')}
//           btnHeight={height * 0.06}
//           btnWidth={width * 0.9}
//           backgroundColor="transparent"
//           textColor={colors.mantineBlue}
//           borderColor={colors.mantineBlue}
//           borderWidth={1}
//           borderRadius={8}
//           leftIcon={<Ionicons name="add" size={width * 0.06} color={colors.mantineBlue} />}
//         />

//         {isLoading ? (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color={colors.mantineBlue} />
//           </View>
//         ) : isError ? (
//           <Text style={styles.emptyText}>No expenses</Text>
//         ) : expenses.length === 0 ? (
//           <Text style={styles.emptyText}>No expenses added yet.</Text>
//         ) : (
//           <FlatList
//             data={expenses}
//             keyExtractor={item => item._id}
//             renderItem={renderItem}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.list}
//             refreshing={isRefetching}
//             onRefresh={refetch}
//             ListFooterComponent={
//               isRefetching ? (
//                 <ActivityIndicator
//                   size="small"
//                   color={colors.mantineBlue}
//                   style={{ marginTop: height * 0.02 }}
//                 />
//               ) : null
//             }
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: width * 0.05,
//     paddingTop: height * 0.03,
//   },
//   loaderContainer: {
//     marginTop: height * 0.06,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyText: {
//     marginTop: height * 0.04,
//     textAlign: 'center',
//     color: colors.gray,
//     fontSize: fontSizes.sm2,
//     fontFamily: fontFamily.UrbanistMedium,
//   },
//   list: {
//     marginTop: height * 0.035,
//     paddingBottom: height * 0.04,
//     gap: height * 0.015,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: width * 0.04,
//     paddingVertical: height * 0.018,
//     paddingHorizontal: width * 0.04,
//     backgroundColor: colors.cardBg,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   info: {
//     flex: 1,
//   },
//   payee: {
//     fontSize: fontSizes.sm2,
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '600',
//     color: colors.black,
//   },
//   description: {
//     marginTop: 2,
//     fontSize: fontSizes.sm,
//     fontFamily: fontFamily.UrbanistMedium,
//     color: colors.gray,
//   },
//   meta: {
//     marginTop: 4,
//     fontSize: fontSizes.sm,
//     fontFamily: fontFamily.UrbanistMedium,
//     color: colors.gray,
//   },
//   right: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   amount: {
//     fontSize: fontSizes.sm2,
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '700',
//     color: colors.black,
//   },
// });

// export default ExpensesFlatList;
