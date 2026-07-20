import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';
import { width } from '../utils';
import { usePnL, PnL } from '../api/usePnl';

const formatPKR = (n?: number | null) => `Rs ${(n ?? 0).toLocaleString('en-PK')}`;
const formatNum = (n?: number | null) => (n ?? 0).toLocaleString('en-PK');
const formatMonthLabel = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '';

/**
 * API ko "YYYY-MM" chahiye, poori ISO timestamp nahi.
 * Local getFullYear/getMonth se banate hain — iso.slice(0, 7) galat mahina de
 * deta hai, kyunki PKT (+05:00) mein mahine ki 1 tareekh UTC par pichhle
 * mahine ki aakhri raat banti hai.
 */
const toMonthParam = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const generateYearMonths = (year: number): string[] =>
  Array.from({ length: 12 }, (_, i) => new Date(year, i, 1).toISOString());

const MONTHS: string[] = generateYearMonths(new Date().getFullYear());

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

  const { data, isLoading, isError, error } = usePnL({
    month: toMonthParam(selectedMonth),
  });

  const selected: PnL = useMemo(() => {
    const base = EMPTY_PNL(selectedMonth);
    // API record ko kabhi `data` ke andar bhejta hai, kabhi top level par —
    // baaki saare endpoints ki tarhan yahan bhi dono handle karne padte hain.
    const record = ((data as any)?.data ?? data) as PnL | undefined;
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
  const selectedIndex = MONTHS.findIndex(m => formatMonthLabel(m) === formatMonthLabel(selectedMonth));

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={() => setPickerVisible(true)}>
        <Text style={styles.headerTitle}>Gift 360 P&L</Text>
        <View style={styles.monthPill}>
          <Text style={styles.monthPillText}>{formatMonthLabel(selectedMonth)}</Text>
          <Text style={styles.chevron}>▾</Text>
        </View>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.purple ?? '#7C3AED'} />
        </View>
      ) : isError ? (
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>Failed to load P&L data</Text>
          {/* Asal server message dikhao — warna status code debugging mein atak jati hai. */}
          {!!error?.message && (
            <Text style={styles.errorDetail}>{error.message}</Text>
          )}
        </View>
      ) : (
        <View style={styles.body}>
          <Row label="Fixed Cost" value={formatPKR(selected.totalFixedCost)} accent={colors.orange ?? '#F59E0B'} bold />
          <SubRow label="Head Count" value={formatNum(selected.salary.count)} />
          <SubRow label="Salary" value={formatPKR(selected.salary.amount)} />
          {selected.fixedCost.map(item => (
            <SubRow key={item._id} label={item.title} value={formatPKR(item.amount)} />
          ))}
          <Divider />

          <Row label="Variable Cost" value={formatPKR(selected.totalVariableCost)} accent={colors.purple ?? '#7C3AED'} bold />
          {selected.variableCost.map(item => (
            <SubRow key={item._id} label={item.title} value={formatPKR(item.amount)} />
          ))}
          <Divider />

          <Row label="No. Of Orders" value={formatNum(selected.sales.count)} accent="#0EA5E9" />
          <Divider />
          <Row label="Sales Amount" value={formatPKR(selected.sales.amount)} accent={colors.purple ?? '#7C3AED'} />
          <Divider />
          <Row label="Total Cost" value={formatPKR(selected.totalCost)} accent={colors.orange ?? '#F59E0B'} />
          <Divider />
          <Row label="Profit" value={formatPKR(selected.profit)} accent={isProfit ? '#16A34A' : '#DC2626'} big />
        </View>
      )}

      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPickerVisible(false)}>
          <View style={styles.pickerBox}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <FlatList
              data={MONTHS}
              keyExtractor={item => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, index === selectedIndex && styles.pickerItemActive]}
                  onPress={() => { setSelectedMonth(item); setPickerVisible(false); }}
                >
                  <Text style={[styles.pickerItemText, index === selectedIndex && styles.pickerItemTextActive]}>
                    {formatMonthLabel(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Row = ({ label, value, accent, big, bold }: { label: string; value: string; accent: string; big?: boolean; bold?: boolean }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
    </View>
    <Text style={[styles.rowValue, big && styles.rowValueBig, bold && styles.rowValueBold, { color: accent }]}>{value}</Text>
  </View>
);

const SubRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.subRow}>
    <Text style={styles.subRowLabel}>{label}</Text>
    <Text style={styles.subRowValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  card: { 
    width: width * 0.9, 
    alignSelf: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginTop: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 4, 
    overflow: 'hidden' 
},
  header: { 
    backgroundColor: '#EDE9FE', 
    paddingVertical: 14, 
    paddingHorizontal: 18, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
},
  headerTitle: { 
    fontFamily: fontFamily.UrbanistSemiBold, 
    fontSize: fontSizes.md, 
    color: '#4C1D95' 
},
  monthPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    paddingHorizontal: 12, 
    paddingVertical: 6 
},
  monthPillText: { fontFamily: fontFamily.UrbanistSemiBold, fontSize: fontSizes.sm, color: '#4C1D95', marginRight: 4 },
  chevron: { color: '#4C1D95', fontSize: 12 },
  body: { paddingHorizontal: 18, paddingVertical: 12 },
  loadingBox: { paddingVertical: 32, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontFamily: fontFamily.UrbanistMedium, fontSize: fontSizes.sm, color: '#DC2626' },
  errorDetail: { fontFamily: fontFamily.UrbanistMedium, fontSize: fontSizes.xs, color: '#6B7280', textAlign: 'center', marginTop: 6, paddingHorizontal: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  rowLabel: { fontFamily: fontFamily.UrbanistMedium, fontSize: fontSizes.sm, color: colors.black },
  rowLabelBold: { fontFamily: fontFamily.UrbanistSemiBold },
  rowValue: { fontFamily: fontFamily.UrbanistSemiBold, fontSize: fontSizes.sm },
  rowValueBig: { fontSize: fontSizes.md },
  rowValueBold: { fontFamily: fontFamily.UrbanistSemiBold },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingLeft: 16 },
  subRowLabel: { fontFamily: fontFamily.UrbanistMedium, fontSize: fontSizes.xs ?? 12, color: '#6B7280', textTransform: 'capitalize' },
  subRowValue: { fontFamily: fontFamily.UrbanistMedium, fontSize: fontSizes.xs ?? 12, color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#F1F1F1', marginVertical: 4 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  pickerBox: { width: width * 0.7, maxHeight: 320, backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  pickerTitle: { fontFamily: fontFamily.UrbanistSemiBold, fontSize: fontSizes.md, marginBottom: 8, color: colors.black },
  pickerItem: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  pickerItemActive: { 
    backgroundColor: '#EDE9FE' 
},
  pickerItemText: { 
    fontFamily: fontFamily.UrbanistMedium, 
    fontSize: fontSizes.sm, 
    color: colors.black 
},
  pickerItemTextActive: { 
    color: '#4C1D95' 
},
});

export default PnlCard;