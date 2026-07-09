import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';
import { width } from '../utils';

type MonthData = {
  month: string;
  headCount: number;
  salary: number;
  operationCost: number;
  fixedCost: number;
  inventory: number;
  marketing: number;
  variableCost: number;
  noOfOrders: number;
  salesAmount: number;
  totalCost: number;
  profit: number;
};

const generateYearData = (year: number): MonthData[] => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthNames.map(m => {
    const headCount = 0;
    const salary = 0;
    const operationCost = 0;
    const fixedCost = salary + operationCost;

    const inventory = 0;
    const marketing = 0;
    const variableCost = inventory + marketing;

    const noOfOrders = 0;
    const salesAmount = 0;
    const totalCost = fixedCost + variableCost;
    const profit = salesAmount - totalCost;

    return {
      month: `${m} ${year}`,
      headCount,
      salary,
      operationCost,
      fixedCost,
      inventory,
      marketing,
      variableCost,
      noOfOrders,
      salesAmount,
      totalCost,
      profit,
    };
  });
};

const CURRENT_YEAR = new Date().getFullYear();
const PNL_DATA: MonthData[] = generateYearData(CURRENT_YEAR);

const formatPKR = (num: number) => `Rs ${num.toLocaleString('en-PK')}`;
const formatNum = (num: number) => num.toLocaleString('en-PK');

const PnlCard = () => {
  const currentMonthLabel = new Date().toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const defaultIndex = Math.max(
    0,
    PNL_DATA.findIndex(d => d.month === currentMonthLabel),
  );

  const [selectedIndex, setSelectedIndex] = useState(
    defaultIndex === -1 ? PNL_DATA.length - 1 : defaultIndex,
  );
  const [pickerVisible, setPickerVisible] = useState(false);

  const selected = useMemo(() => PNL_DATA[selectedIndex], [selectedIndex]);
  const isProfit = selected.profit >= 0;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={styles.headerTitle}>Gift 360 P&L</Text>
        <View style={styles.monthPill}>
          <Text style={styles.monthPillText}>{selected.month}</Text>
          <Text style={styles.chevron}>▾</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <Row
          label="Fixed Cost"
          value={formatPKR(selected.fixedCost)}
          accent={colors.orange ?? '#F59E0B'}
          bold
        />
        <SubRow label="Head Count" value={formatNum(selected.headCount)} />
        <SubRow label="Salary" value={formatPKR(selected.salary)} />
        <SubRow
          label="Operation Cost"
          value={formatPKR(selected.operationCost)}
        />

        <Divider />

        {/* Variable Cost group */}
        <Row
          label="Variable Cost"
          value={formatPKR(selected.variableCost)}
          accent={colors.purple ?? '#7C3AED'}
          bold
        />
        <SubRow label="Inventory" value={formatPKR(selected.inventory)} />
        <SubRow label="Marketing" value={formatPKR(selected.marketing)} />

        <Divider />

        <Row
          label="No. Of Orders"
          value={formatNum(selected.noOfOrders)}
          accent={'#0EA5E9'}
        />
        <Divider />
        <Row
          label="Sales Amount"
          value={formatPKR(selected.salesAmount)}
          accent={colors.purple ?? '#7C3AED'}
        />
        <Divider />
        <Row
          label="Total Cost"
          value={formatPKR(selected.totalCost)}
          accent={colors.orange ?? '#F59E0B'}
        />
        <Divider />
        <Row
          label="Profit"
          value={formatPKR(selected.profit)}
          accent={isProfit ? '#16A34A' : '#DC2626'}
          big
        />
      </View>

      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.pickerBox}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <FlatList
              data={PNL_DATA}
              keyExtractor={item => item.month}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    index === selectedIndex && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setSelectedIndex(index);
                    setPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      index === selectedIndex && styles.pickerItemTextActive,
                    ]}
                  >
                    {item.month}
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

const Row = ({
  label,
  value,
  accent,
  big,
  bold,
}: {
  label: string;
  value: string;
  accent: string;
  big?: boolean;
  bold?: boolean;
}) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>
        {label}
      </Text>
    </View>
    <Text
      style={[
        styles.rowValue,
        big && styles.rowValueBig,
        bold && styles.rowValueBold,
        { color: accent },
      ]}
    >
      {value}
    </Text>
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
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#EDE9FE',
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: '#4C1D95',
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  monthPillText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: '#4C1D95',
    marginRight: 4,
  },
  chevron: { color: '#4C1D95', fontSize: 12 },
  body: { paddingHorizontal: 18, paddingVertical: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  rowLabel: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  rowLabelBold: {
    fontFamily: fontFamily.UrbanistSemiBold,
  },
  rowValue: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
  },
  rowValueBig: { fontSize: fontSizes.md },
  rowValueBold: {
    fontFamily: fontFamily.UrbanistSemiBold,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 16,
  },
  subRowLabel: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs ?? 12,
    color: '#6B7280',
  },
  subRowValue: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xs ?? 12,
    color: '#6B7280',
  },
  divider: { height: 1, backgroundColor: '#F1F1F1', marginVertical: 4 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBox: {
    width: width * 0.7,
    maxHeight: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  pickerTitle: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    marginBottom: 8,
    color: colors.black,
  },
  pickerItem: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  pickerItemActive: { backgroundColor: '#EDE9FE' },
  pickerItemText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  pickerItemTextActive: { color: '#4C1D95' },
});

export default PnlCard;
