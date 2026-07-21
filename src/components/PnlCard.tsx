// import React, { useState, useMemo } from 'react';
// import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@react-native-vector-icons/ionicons';
// import { fontFamily } from '../assets/Fonts';
// import { colors } from '../utils/colors';
// import { fontSizes } from '../utils/fontSizes';
// import { width } from '../utils';
// import { usePnL, PnL } from '../api/usePnl';
// import { CustomButton } from '../components';
// import formatAmount from '../utils/formatAmount';
// import formatNumber from '../utils/formatNumber';
// import formatDate from '../utils/formatDate';

// const toMonthParam = (iso: string) => {
//   const date = new Date(iso);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// };

// const generateYearMonths = (year: number): string[] =>
//   Array.from({ length: 12 }, (_, i) => new Date(year, i, 1).toISOString());

// const MONTHS: string[] = generateYearMonths(new Date().getFullYear());

// const EMPTY_PNL = (month: string): PnL => ({
//   month,
//   salary: { count: 0, amount: 0 },
//   fixedCost: [],
//   variableCost: [],
//   sales: { count: 0, amount: 0 },
//   totalFixedCost: 0,
//   totalVariableCost: 0,
//   totalCost: 0,
//   profit: 0,
// });

// const PnlCard = () => {
//   const currentMonthIso = useMemo(() => {
//     const now = new Date();
//     return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
//   }, []);

//   const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthIso);
//   const [pickerVisible, setPickerVisible] = useState(false);

//   const { data, isLoading, isError, error, refetch } = usePnL({
//     month: toMonthParam(selectedMonth),
//   });

//   // API returns an array of month records — find the one matching selectedMonth.
//   const selected: PnL = useMemo(() => {
//     const base = EMPTY_PNL(selectedMonth);

//     const raw = (data as any)?.data ?? data;
//     const list: PnL[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

//     if (list.length === 0) return base;

//     const targetKey = toMonthParam(selectedMonth);
//     const record = list.find(item => item?.month && toMonthParam(item.month) === targetKey);

//     if (!record) return base;

//     return {
//       ...base,
//       ...record,
//       salary: { ...base.salary, ...record.salary },
//       sales: { ...base.sales, ...record.sales },
//       fixedCost: record.fixedCost ?? base.fixedCost,
//       variableCost: record.variableCost ?? base.variableCost,
//     };
//   }, [data, selectedMonth]);

//   const isProfit = selected.profit >= 0;
//   const selectedIndex = MONTHS.indexOf(selectedMonth);

//   return (
//     <View style={styles.card}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <View style={styles.headerLeft}>
//           <View style={styles.iconWrap}>
//             <Ionicons name="bar-chart-outline" size={width * 0.05} color={colors.mantineBlue} />
//           </View>
//           <Text style={styles.headerTitle}>Gift 360 P&L</Text>
//         </View>

//         <TouchableOpacity style={styles.monthPill} activeOpacity={0.7} onPress={() => setPickerVisible(true)}>
//           <Ionicons name="calendar-outline" size={width * 0.035} color={colors.mantineBlue} />
//           <Text style={styles.monthPillText}>{formatDate(selectedMonth, 'MMM YYYY')}</Text>
//           <Ionicons name="chevron-down" size={width * 0.035} color={colors.mantineBlue} />
//         </TouchableOpacity>
//       </View>

//       {isLoading ? (
//         <View style={styles.centerState}>
//           <ActivityIndicator size="large" color={colors.mantineBlue} />
//         </View>
//       ) : isError ? (
//         <View style={styles.centerState}>
//           <Ionicons name="cloud-offline-outline" size={width * 0.12} color={colors.lightGray} />
//           <Text style={styles.emptyTitle}>Couldn't load P&L data</Text>
//           {!!error?.message && <Text style={styles.emptyText}>{error.message}</Text>}
//           <CustomButton
//             text="Retry"
//             onPress={() => refetch()}
//             btnHeight={width * 0.1}
//             btnWidth={width * 0.35}
//             backgroundColor={colors.mantineBlue}
//             textColor={colors.white}
//             borderRadius={8}
//           />
//         </View>
//       ) : (
//         <View style={styles.body}>
//           {/* Top summary strip */}
//           <View style={styles.statsStrip}>
//             <View style={styles.statBox}>
//               <View style={styles.statLabelRow}>
//                 <Ionicons name="wallet-outline" size={width * 0.03} color={colors.mantineBlue} />
//                 <Text style={styles.statLabel}>Total Cost</Text>
//               </View>
//               <Text style={styles.statValue} numberOfLines={1}>
//                 {formatAmount(selected.totalCost)}
//               </Text>
//             </View>

//             <View style={styles.statDivider} />
//              <View style={styles.statBox}>
//               <View style={styles.statLabelRow}>
//                 <Ionicons name="cart-outline" size={width * 0.03} color={colors.mantineBlue} />
//                 <Text style={styles.statLabel}>Sales</Text>
//               </View>
//               <Text style={styles.statValue} numberOfLines={1}>
//                 {formatAmount(selected.sales.amount)}
//               </Text>
//             </View>

//             <View style={styles.statDivider} />

//             <View style={styles.statBox}>
//               <View style={styles.statLabelRow}>
//                 <Ionicons
//                   name={isProfit ? 'trending-up-outline' : 'trending-down-outline'}
//                   size={width * 0.03}
//                   color={isProfit ? '#2B8A3E' : '#C2255C'}
//                 />
//                 <Text style={styles.statLabel}>Profit</Text>
//               </View>
//               <Text
//                 style={[styles.statValue, { color: isProfit ? '#2B8A3E' : '#C2255C' }]}
//                 numberOfLines={1}
//               >
//                 {formatAmount(selected.profit)}
//               </Text>
//             </View>
//           </View>

//           {/* Orders + status badge */}
//           <View style={styles.metaRowBetween}>
//             <View style={styles.metaRow}>
//               <Ionicons name="receipt-outline" size={width * 0.034} color={colors.gray} />
//               <Text style={styles.meta}>
//                 {formatNumber(selected.sales.count, 'standard')} orders this month
//               </Text>
//             </View>

//             <View
//               style={[
//                 styles.statusBadge,
//                 { backgroundColor: isProfit ? '#E8F7EC' : '#FDECF1' },
//               ]}
//             >
//               <Text style={[styles.statusText, { color: isProfit ? '#2B8A3E' : '#C2255C' }]}>
//                 {isProfit ? 'Profitable' : 'Loss'}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.divider} />

//           {/* Fixed cost breakdown */}
//           <View style={styles.sectionHeaderRow}>
//             <View style={styles.sectionTitleRow}>
//               <Ionicons name="business-outline" size={width * 0.036} color={colors.mantineBlue} />
//               <Text style={styles.sectionTitle}>Fixed Cost</Text>
//             </View>
//             <Text style={styles.sectionTotal}>{formatAmount(selected.totalFixedCost)}</Text>
//           </View>

//           <SubRow label="Head Count" value={formatNumber(selected.salary.count, 'standard')} />
//           <SubRow label="Salary" value={formatAmount(selected.salary.amount)} />
//           {selected.fixedCost.map(item => (
//             <SubRow key={item._id} label={item.title} value={formatAmount(item.amount)} />
//           ))}

//           <View style={styles.divider} />

//           {/* Variable cost breakdown */}
//           <View style={styles.sectionHeaderRow}>
//             <View style={styles.sectionTitleRow}>
//               <Ionicons name="swap-vertical-outline" size={width * 0.036} color={colors.mantineBlue} />
//               <Text style={styles.sectionTitle}>Variable Cost</Text>
//             </View>
//             <Text style={styles.sectionTotal}>{formatAmount(selected.totalVariableCost)}</Text>
//           </View>

//           {selected.variableCost.map(item => (
//             <SubRow key={item._id} label={item.title} value={formatAmount(item.amount)} />
//           ))}
//         </View>
//       )}

//       {/* Month picker modal */}
//       <Modal visible={pickerVisible} transparent animationType="fade">
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPickerVisible(false)}>
//           <View style={styles.pickerBox}>
//             <Text style={styles.pickerTitle}>Select Month</Text>
//             <FlatList
//               data={MONTHS}
//               keyExtractor={item => item}
//               renderItem={({ item, index }) => (
//                 <TouchableOpacity
//                   style={[styles.pickerItem, index === selectedIndex && styles.pickerItemActive]}
//                   onPress={() => {
//                     setSelectedMonth(item);
//                     setPickerVisible(false);
//                   }}
//                 >
//                   <Text style={[styles.pickerItemText, index === selectedIndex && styles.pickerItemTextActive]}>
//                     {formatDate(item, 'MMM YYYY')}
//                   </Text>
//                   {index === selectedIndex && (
//                     <Ionicons name="checkmark-circle" size={width * 0.045} color={colors.mantineBlue} />
//                   )}
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const SubRow = ({ label, value }: { label: string; value: string }) => (
//   <View style={styles.subRow}>
//     <Text style={styles.subRowLabel} numberOfLines={1}>
//       {label}
//     </Text>
//     <Text style={styles.subRowValue}>{value}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   card: {
//     width: width * 0.9,
//     alignSelf: 'center',
//     backgroundColor: colors.white,
//     borderRadius: 18,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: colors.border,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//     overflow: 'hidden',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     backgroundColor: colors.cardBg,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   iconWrap: {
//     width: width * 0.09,
//     height: width * 0.09,
//     borderRadius: width * 0.055,
//     backgroundColor: colors.mantineBlue + '14',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontFamily: fontFamily.UrbanistSemiBold,
//     fontSize: fontSizes.md,
//     color: colors.black,
//   },
//   monthPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: colors.white,
//     borderRadius: 14,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   monthPillText: {
//     fontFamily: fontFamily.UrbanistSemiBold,
//     fontSize: fontSizes.xs ?? 12,
//     color: colors.mantineBlue,
//   },
//   centerState: {
//     paddingVertical: 32,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 10,
//   },
//   emptyTitle: {
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '700',
//     fontSize: fontSizes.sm2,
//     color: colors.black,
//   },
//   emptyText: {
//     fontFamily: fontFamily.UrbanistMedium,
//     fontSize: fontSizes.xs,
//     color: colors.gray,
//     textAlign: 'center',
//   },
//   body: { paddingHorizontal: 16, paddingVertical: 14 },
//   statsStrip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     backgroundColor: colors.cardBg,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.border,
//     marginBottom: 12,
//   },
//   statBox: { flex: 1, alignItems: 'flex-start', gap: 2 },
//   statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   statLabel: {
//     fontFamily: fontFamily.UrbanistMedium,
//     fontSize: fontSizes.xs ?? 11,
//     color: colors.gray,
//   },
//   statValue: {
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '700',
//     fontSize: fontSizes.sm,
//     color: colors.black,
//   },
//   statDivider: {
//     width: 1,
//     height: width * 0.08,
//     backgroundColor: colors.border,
//     marginHorizontal: 10,
//   },
//   metaRowBetween: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
//   meta: {
//     fontFamily: fontFamily.UrbanistMedium,
//     fontSize: fontSizes.xs,
//     color: colors.gray,
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   statusText: {
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '600',
//     fontSize: fontSizes.xs ?? 11,
//   },
//   divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
//   sectionHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   sectionTitle: {
//     fontFamily: fontFamily.UrbanistSemiBold,
//     fontSize: fontSizes.sm,
//     color: colors.black,
//   },
//   sectionTotal: {
//     fontFamily: fontFamily.UrbanistBold,
//     fontWeight: '700',
//     fontSize: fontSizes.sm,
//     color: colors.mantineBlue,
//   },
//   subRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingLeft: 22,
//   },
//   subRowLabel: {
//     flex: 1,
//     fontFamily: fontFamily.UrbanistMedium,
//     fontSize: fontSizes.xs ?? 12,
//     color: colors.gray,
//     textTransform: 'capitalize',
//     marginRight: 8,
//   },
//   subRowValue: {
//     fontFamily: fontFamily.UrbanistMedium,
//     fontSize: fontSizes.xs ?? 12,
//     color: colors.black,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pickerBox: {
//     width: width * 0.7,
//     maxHeight: 320,
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     padding: 16,
//   },
//   pickerTitle: {
//     fontFamily: fontFamily.UrbanistSemiBold,
//     fontSize: fontSizes.md,
//     marginBottom: 8,
//     color: colors.black,
//   },
//   pickerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//   },
//   pickerItemActive: {
//     backgroundColor: colors.mantineBlue + '14',
//   },
//   pickerItemText: {
//     fontFamily: fontFamily.UrbanistMedium,
//     fontSize: fontSizes.sm,
//     color: colors.black,
//   },
//   pickerItemTextActive: {
//     color: colors.mantineBlue,
//     fontFamily: fontFamily.UrbanistSemiBold,
//   },
// });

// export default PnlCard;

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, SectionList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { fontFamily } from '../assets/Fonts';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';
import { width } from '../utils';
import { usePnL, PnL } from '../api/usePnl';
import { CustomButton } from '../components';
import formatAmount from '../utils/formatAmount';
import formatNumber from '../utils/formatNumber';
import formatDate from '../utils/formatDate';

const toMonthParam = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const generateYearMonths = (year: number): string[] =>
  Array.from({ length: 12 }, (_, i) => new Date(year, i, 1).toISOString());

// Sirf current year tak mehdood nahi — pichle kuch saalon ka data bhi milna
// chahiye, is liye ab ek range banate hain (currentYear se YEARS_BACK peeche tak).
const YEARS_BACK = 5;
const CURRENT_YEAR = new Date().getFullYear();

const YEAR_SECTIONS = Array.from({ length: YEARS_BACK + 1 }, (_, i) => CURRENT_YEAR - i).map(
  year => ({
    year,
    title: String(year),
    data: generateYearMonths(year).reverse(), // Dec -> Jan, taake latest month upar rahe
  }),
);

const MONTHS: string[] = YEAR_SECTIONS.flatMap(section => section.data);

const EMPTY_PNL = (month: string): PnL => ({
  month,
  salary: { count: 0, amount: 0 },
  fixedCost: [],
  variableCost: [],
  sales: { count: 0, amount: 0 },
  totalFixedCost: 0,
  totalVariableCost: 0,
  totalCost: 0,
  profit: 0,
});

const PnlCard = () => {
  const currentMonthIso = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthIso);
  const [pickerVisible, setPickerVisible] = useState(false);

  const { data, isLoading, isError, error, refetch } = usePnL({
    month: toMonthParam(selectedMonth),
  });

  // API returns an array of month records — find the one matching selectedMonth.
  const selected: PnL = useMemo(() => {
    const base = EMPTY_PNL(selectedMonth);

    const raw = (data as any)?.data ?? data;
    const list: PnL[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

    if (list.length === 0) return base;

    const targetKey = toMonthParam(selectedMonth);
    const record = list.find(item => item?.month && toMonthParam(item.month) === targetKey);

    if (!record) return base;

    return {
      ...base,
      ...record,
      salary: { ...base.salary, ...record.salary },
      sales: { ...base.sales, ...record.sales },
      fixedCost: record.fixedCost ?? base.fixedCost,
      variableCost: record.variableCost ?? base.variableCost,
    };
  }, [data, selectedMonth]);

  const isProfit = selected.profit >= 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="bar-chart-outline" size={width * 0.05} color={colors.mantineBlue} />
          </View>
          <Text style={styles.headerTitle}>Gift 360 P&L</Text>
        </View>

        <TouchableOpacity style={styles.monthPill} activeOpacity={0.7} onPress={() => setPickerVisible(true)}>
          <Ionicons name="calendar-outline" size={width * 0.035} color={colors.mantineBlue} />
          <Text style={styles.monthPillText}>{formatDate(selectedMonth, 'MMM YYYY')}</Text>
          <Ionicons name="chevron-down" size={width * 0.035} color={colors.mantineBlue} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      ) : isError ? (
        <View style={styles.centerState}>
          <Ionicons name="cloud-offline-outline" size={width * 0.12} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>Couldn't load P&L data</Text>
          {!!error?.message && <Text style={styles.emptyText}>{error.message}</Text>}
          <CustomButton
            text="Retry"
            onPress={() => refetch()}
            btnHeight={width * 0.1}
            btnWidth={width * 0.35}
            backgroundColor={colors.mantineBlue}
            textColor={colors.white}
            borderRadius={8}
          />
        </View>
      ) : (
        <View style={styles.body}>
          {/* Top summary strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <View style={styles.statLabelRow}>
                <Ionicons name="wallet-outline" size={width * 0.03} color={colors.mantineBlue} />
                <Text style={styles.statLabel}>Total Cost</Text>
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {formatAmount(selected.totalCost)}
              </Text>
            </View>

            <View style={styles.statDivider} />
             <View style={styles.statBox}>
              <View style={styles.statLabelRow}>
                <Ionicons name="cart-outline" size={width * 0.03} color={colors.mantineBlue} />
                <Text style={styles.statLabel}>Sales</Text>
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {formatAmount(selected.sales.amount)}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View style={styles.statLabelRow}>
                <Ionicons
                  name={isProfit ? 'trending-up-outline' : 'trending-down-outline'}
                  size={width * 0.03}
                  color={isProfit ? '#2B8A3E' : '#C2255C'}
                />
                <Text style={styles.statLabel}>Profit</Text>
              </View>
              <Text
                style={[styles.statValue, { color: isProfit ? '#2B8A3E' : '#C2255C' }]}
                numberOfLines={1}
              >
                {formatAmount(selected.profit)}
              </Text>
            </View>
          </View>

          {/* Orders highlight + profit/loss status */}
          <View style={styles.metaRowBetween}>
            <View style={styles.ordersBadge}>
              <Ionicons name="receipt" size={width * 0.04} color={colors.mantineBlue} />
              <Text style={styles.ordersBadgeValue}>
                {formatNumber(selected.sales.count, 'standard')}
              </Text>
              <Text style={styles.ordersBadgeLabel}>orders this month</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isProfit ? '#E8F7EC' : '#FDECF1' },
              ]}
            >
              <Text style={[styles.statusText, { color: isProfit ? '#2B8A3E' : '#C2255C' }]}>
                {isProfit ? 'Profitable' : 'Loss'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Fixed cost breakdown */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="business-outline" size={width * 0.036} color={colors.mantineBlue} />
              <Text style={styles.sectionTitle}>Fixed Cost</Text>
            </View>
            <Text style={styles.sectionTotal}>{formatAmount(selected.totalFixedCost)}</Text>
          </View>

          <SubRow label="Head Count" value={formatNumber(selected.salary.count, 'standard')} />
          <SubRow label="Salary" value={formatAmount(selected.salary.amount)} />
          {selected.fixedCost.map(item => (
            <SubRow key={item._id} label={item.title} value={formatAmount(item.amount)} />
          ))}

          <View style={styles.divider} />

          {/* Variable cost breakdown */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="swap-vertical-outline" size={width * 0.036} color={colors.mantineBlue} />
              <Text style={styles.sectionTitle}>Variable Cost</Text>
            </View>
            <Text style={styles.sectionTotal}>{formatAmount(selected.totalVariableCost)}</Text>
          </View>

          {selected.variableCost.map(item => (
            <SubRow key={item._id} label={item.title} value={formatAmount(item.amount)} />
          ))}
        </View>
      )}

      {/* Month picker modal — ab saalon ke section ke saath */}
      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPickerVisible(false)}>
          <View style={styles.pickerBox}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <SectionList
              sections={YEAR_SECTIONS}
              keyExtractor={item => item}
              stickySectionHeadersEnabled
              renderSectionHeader={({ section }) => (
                <Text style={styles.pickerYearHeader}>{section.title}</Text>
              )}
              renderItem={({ item }) => {
                const isActive = item === selectedMonth;
                return (
                  <TouchableOpacity
                    style={[styles.pickerItem, isActive && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedMonth(item);
                      setPickerVisible(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, isActive && styles.pickerItemTextActive]}>
                      {formatDate(item, 'MMM YYYY')}
                    </Text>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={width * 0.045} color={colors.mantineBlue} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const SubRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.subRow}>
    <Text style={styles.subRowLabel} numberOfLines={1}>
      {label}
    </Text>
    <Text style={styles.subRowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.055,
    backgroundColor: colors.mantineBlue + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.xs ?? 12,
    color: colors.mantineBlue,
  },
  centerState: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    fontSize: fontSizes.sm2,
    color: colors.black,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs,
    color: colors.gray,
    textAlign: 'center',
  },
  body: { paddingHorizontal: 16, paddingVertical: 14 },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  statBox: { flex: 1, alignItems: 'flex-start', gap: 2 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs ?? 11,
    color: colors.gray,
  },
  statValue: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  statDivider: {
    width: 1,
    height: width * 0.08,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  metaRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  // Orders ab ek highlighted chip hai — plain gray text nahi.
  ordersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.mantineBlue + '14',
    borderWidth: 1,
    borderColor: colors.mantineBlue + '30',
  },
  ordersBadgeValue: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '800',
    fontSize: fontSizes.sm,
    color: colors.mantineBlue,
  },
  ordersBadgeLabel: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs ?? 11,
    color: colors.mantineBlue,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    fontSize: fontSizes.xs ?? 11,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  sectionTotal: {
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    fontSize: fontSizes.sm,
    color: colors.mantineBlue,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 22,
  },
  subRowLabel: {
    flex: 1,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs ?? 12,
    color: colors.gray,
    textTransform: 'capitalize',
    marginRight: 8,
  },
  subRowValue: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs ?? 12,
    color: colors.black,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBox: {
    width: width * 0.7,
    maxHeight: width * 1.1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  pickerTitle: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    marginBottom: 8,
    color: colors.black,
  },
  pickerYearHeader: {
    backgroundColor: colors.white,
    paddingVertical: 6,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    fontSize: fontSizes.xs ?? 12,
    color: colors.mantineBlue,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pickerItemActive: {
    backgroundColor: colors.mantineBlue + '14',
  },
  pickerItemText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  pickerItemTextActive: {
    color: colors.mantineBlue,
    fontFamily: fontFamily.UrbanistSemiBold,
  },
});

export default PnlCard;