// PayrollDetailScreen.tsx
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useQueryClient } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Payroll, useDeletePayroll, usePayroll } from '../../api/usePayrolls';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { colors } from '../../utils/colors';
import formatAmount from '../../utils/formatAmount';
import formatDate from '../../utils/formatDate';
import { fontSizes } from '../../utils/fontSizes';
import { formatMonth } from './options';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'PayrollDetailScreen'>;

const DANGER_COLOR = '#C2255C';
const DANGER_TINT = '#FDECF1';
const EDIT_TINT = '#EDF0FE';

const DetailRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const PayrollDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const queryClient = useQueryClient();
  const { payrollId } = route.params;

  const { data, isLoading, isError, refetch, isRefetching } =
    usePayroll(payrollId);
  const { deletePayroll, isPending: isDeleting } = useDeletePayroll();

  const payroll = ((data as any)?.data ?? data) as Payroll | undefined;

  const onEdit = () => navigation.navigate('EditPayroll', { payrollId });

  const onDelete = () => {
    Alert.alert(
      'Delete Payroll',
      'Are you sure you want to delete this payroll?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deletePayroll({ id: payrollId });
              await queryClient.invalidateQueries({ queryKey: ['payrolls'] });

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: res?.message || 'Payroll deleted successfully',
              });

              navigation.goBack();
            } catch (err: any) {
              Toast.show({
                type: 'error',
                text1: 'Could not delete payroll',
                text2:
                  err?.message || 'Something went wrong. Please try again.',
              });
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopHeader text="Payroll" isBack />
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      </View>
    );
  }

  if (isError || !payroll) {
    return (
      <View style={styles.container}>
        <TopHeader text="Payroll" isBack />
        <View style={styles.centerFill}>
          <Ionicons
            name="cloud-offline-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.errorText}>Could not load this payroll.</Text>
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
      </View>
    );
  }

  const employeeName =
    [payroll.employee?.personal?.firstName, payroll.employee?.personal?.lastName]
      .filter(Boolean)
      .join(' ') || 'Unknown employee';

  const employeeEmail =
    payroll.employee?.contact?.officialEmail ||
    payroll.employee?.contact?.personalEmail ||
    '-';

  const department = payroll.employee?.organization?.department?.title;
  const designation = payroll.employee?.organization?.designation?.title;

  return (
    <View style={styles.container}>
      <TopHeader text={capitalizeLetters(employeeName)} isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Payroll profile — pehchan aur ahem numbers ek nazar mein. */}
        <View style={styles.profileCard}>
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.6}
              onPress={onEdit}
              disabled={isDeleting}
              hitSlop={10}
            >
              <Ionicons
                name="pencil"
                size={width * 0.036}
                color={colors.mantineBlue}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              activeOpacity={0.6}
              onPress={onDelete}
              disabled={isDeleting}
              hitSlop={10}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={DANGER_COLOR} />
              ) : (
                <Ionicons
                  name="trash"
                  size={width * 0.036}
                  color={DANGER_COLOR}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.profileAvatar}>
            <Ionicons
              name="person-outline"
              size={width * 0.1}
              color={colors.white}
            />
          </View>

          <Text style={styles.profileName} numberOfLines={2}>
            {capitalizeLetters(employeeName)}
          </Text>
          <Text style={styles.profileMonth}>
            {formatMonth(payroll.month)}
            {designation ? ` · ${capitalizeLetters(designation)}` : ''}
          </Text>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatAmount(payroll.netSalary)}
              </Text>
              <Text style={styles.profileStatLabel}>Net Salary</Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatAmount(payroll.salary)}
              </Text>
              <Text style={styles.profileStatLabel}>Salary</Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {formatAmount(payroll.deduction)}
              </Text>
              <Text style={styles.profileStatLabel}>Deduction</Text>
            </View>
          </View>
        </View>

        {/* Earnings breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Breakdown</Text>
          <View style={styles.card}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Salary</Text>
              <Text style={styles.totalValue}>
                {formatAmount(payroll.salary)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Arrears</Text>
              <Text style={styles.totalValue}>
                {formatAmount(payroll.arrears)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Deduction</Text>
              <Text style={styles.totalValue}>
                -{formatAmount(payroll.deduction)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>
                -{formatAmount(payroll.tax)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, styles.netPayLabel]}>
                Net Salary
              </Text>
              <Text style={[styles.totalValue, styles.netPayValue]}>
                {formatAmount(payroll.netSalary)}
              </Text>
            </View>
          </View>
        </View>

        {/* Employee */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee</Text>
          <View style={styles.card}>
            <DetailRow
              label="Employee ID"
              value={payroll.employee?.employeeId || '-'}
            />
            <DetailRow label="Email" value={employeeEmail} />
            <DetailRow label="Phone" value={payroll.employee?.contact?.phone || '-'} />
            <DetailRow
              label="Department"
              value={department ? capitalizeLetters(department) : '-'}
            />
            <DetailRow
              label="Designation"
              value={designation ? capitalizeLetters(designation) : '-'}
              isLast
            />
          </View>
        </View>

        {/* Meta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.card}>
            <DetailRow label="Month" value={formatMonth(payroll.month)} />
            <DetailRow label="Created On" value={formatDate(payroll.createdAt)} />
            <DetailRow
              label="Last Updated"
              value={formatDate(payroll.updatedAt)}
              isLast
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: height * 0.02,
    paddingBottom: height * 0.05,
    gap: height * 0.022,
  },
  profileCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.025,
  },
  profileActions: {
    position: 'absolute',
    top: height * 0.014,
    right: width * 0.035,
    flexDirection: 'row',
    gap: width * 0.02,
    zIndex: 1,
  },
  actionButton: {
    width: width * 0.072,
    height: width * 0.072,
    borderRadius: width * 0.036,
    backgroundColor: EDIT_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDanger: {
    backgroundColor: DANGER_TINT,
  },
  profileAvatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: colors.mantineBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginTop: height * 0.015,
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  profileMonth: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: height * 0.02,
    paddingTop: height * 0.018,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  profileStatValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  profileStatLabel: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    textAlign: 'center',
  },
  profileStatDivider: {
    width: 1,
    height: height * 0.035,
    backgroundColor: colors.border,
  },
  section: {
    gap: height * 0.01,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: width * 0.04,
    gap: height * 0.012,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  totalValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.006,
  },
  netPayLabel: {
    color: colors.black,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  netPayValue: {
    color: colors.mantineBlue,
    fontSize: fontSizes.sm2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.012,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
});

export default PayrollDetailScreen;