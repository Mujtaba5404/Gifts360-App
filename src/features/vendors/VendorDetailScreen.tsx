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
import { Vendor, useDeleteVendor, useVendor } from '../../api/useVendor';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { colors } from '../../utils/colors';
import {
  formatAddress,
  getAvatarColor,
  getInitials,
  pickText,
} from '../../utils/display';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'VendorDetailScreen'>;


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

const Chips = ({ values }: { values: string[] }) => (
  <View style={styles.chipRow}>
    {values.map(value => (
      <View key={value} style={styles.chip}>
        <Text style={styles.chipText}>{capitalizeLetters(value)}</Text>
      </View>
    ))}
  </View>
);

const VendorDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const queryClient = useQueryClient();
  const { vendorId } = route.params;

  const { data, isLoading, isError, refetch, isRefetching } =
    useVendor(vendorId);
  const { deleteVendor, isPending: isDeleting } = useDeleteVendor();

  const vendor = ((data as any)?.data ?? data) as Vendor | undefined;

  const onEdit = () => {
    if (!vendor) return;
    navigation.navigate('EditVendor', { vendor });
  };

  const onDelete = () => {
    Alert.alert(
      'Delete Vendor',
      'Are you sure you want to delete this vendor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteVendor({ id: vendorId });
              await queryClient.invalidateQueries({ queryKey: ['vendor'] });

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: res?.message || 'Vendor deleted successfully',
              });

              navigation.goBack();
            } catch (err: any) {
              Toast.show({
                type: 'error',
                text1: 'Could not delete vendor',
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
        <TopHeader text="Vendor" isBack />
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mantineBlue} />
        </View>
      </View>
    );
  }

  if (isError || !vendor) {
    return (
      <View style={styles.container}>
        <TopHeader text="Vendor" isBack />
        <View style={styles.centerFill}>
          <Ionicons
            name="cloud-offline-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.errorText}>Could not load this vendor.</Text>
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

  const type = pickText(vendor.type);
  const categories = (vendor.categories ?? []).map((c: any) => c.title).filter(Boolean);
  const services = (vendor.services ?? []).map((s: any) => s.title).filter(Boolean);
  const address = formatAddress(vendor.address);

  return (
    <View style={styles.container}>
      <TopHeader text={capitalizeLetters(vendor.title)} isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >

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

          <View
            style={[
              styles.profileAvatar,
              { backgroundColor: getAvatarColor(vendor._id) },
            ]}
          >
            <Text style={styles.profileAvatarText}>
              {getInitials(vendor.title)}
            </Text>
          </View>

          <Text style={styles.profileName} numberOfLines={2}>
            {capitalizeLetters(vendor.title)}
          </Text>
          {!!vendor.email && (
            <Text style={styles.profileSubtitle} numberOfLines={1}>
              {vendor.email}
            </Text>
          )}

          {!!type && (
            <View style={[styles.badge, styles.profileBadge]}>
              <Text style={styles.badgeText}>{capitalizeLetters(type)}</Text>
            </View>
          )}

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>
                {vendor.vendorPercentage != null
                  ? `${vendor.vendorPercentage}%`
                  : '-'}
              </Text>
              <Text style={styles.profileStatLabel}>Percentage</Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{categories.length}</Text>
              <Text style={styles.profileStatLabel}>
                {categories.length === 1 ? 'Category' : 'Categories'}
              </Text>
            </View>

            <View style={styles.profileStatDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{services.length}</Text>
              <Text style={styles.profileStatLabel}>
                {services.length === 1 ? 'Service' : 'Services'}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.card}>
            <DetailRow label="Email" value={vendor.email || '-'} />
            <DetailRow label="Phone" value={vendor.phone || '-'} />
            <DetailRow
              label="Secondary Phone"
              value={vendor.secondaryPhone || '-'}
              isLast
            />
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.card}>
            <DetailRow label="Street" value={capitalizeLetters(vendor.address?.line1 || '-')} />
            <DetailRow label="City" value={capitalizeLetters(vendor.address?.city || '-')} />
            <DetailRow label="State" value={capitalizeLetters(vendor.address?.stateCode || '-')} />
            <DetailRow
              label="Country"
              value={capitalizeLetters(vendor.address?.countryCode || '-')}
              isLast
            />
          </View>
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.card}>
              <Chips values={categories} />
            </View>
          </View>
        )}

        {/* Services */}
        {services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.card}>
              <Chips values={services} />
            </View>
          </View>
        )}

        {/* Meta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.card}>
            <DetailRow
              label="Type"
              value={type ? capitalizeLetters(type) : '-'}
            />
            <DetailRow
              label="Vendor Percentage"
              value={
                vendor.vendorPercentage != null
                  ? `${vendor.vendorPercentage}%`
                  : '-'
              }
            />
            <DetailRow label="Full Address" value={capitalizeLetters(address || '-')} isLast />
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
  // Absolute rakha hai taake avatar card ke beech mein hi rahe, neeche na khiske.
  profileActions: {
    position: 'absolute',
    top: height * 0.014,
    right: width * 0.035,
    flexDirection: 'row',
    gap: width * 0.02,
    zIndex: 1,
  },
  // Halka tinted circle — outline border se zyada saaf lagta hai is chhote size par.
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  profileName: {
    marginTop: height * 0.015,
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  profileSubtitle: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  profileBadge: {
    marginTop: height * 0.014,
  },
  badge: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: 20,
    backgroundColor: EDIT_TINT,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width * 0.02,
  },
  chip: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.007,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
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

export default VendorDetailScreen;
