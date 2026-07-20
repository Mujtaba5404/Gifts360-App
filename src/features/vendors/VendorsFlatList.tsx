import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { AddFab, CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import {
  formatAddress,
  getAvatarColor,
  getInitials,
  pickText,
} from '../../utils/display';
import { fontSizes } from '../../utils/fontSizes';
import { Vendor, useVendors } from '../../api/useVendor';
import capitalizeLetters from '../../utils/capitalizeLetters';

type Nav = NativeStackNavigationProp<RootStackParamList>;



const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, styles.skeletonCard, { opacity }]}>
      <View style={[styles.avatar, styles.skeletonBlock]} />
      <View style={styles.info}>
        <View style={[styles.skeletonLine, { width: '55%' }]} />
        <View style={[styles.skeletonLine, { width: '35%', marginTop: 8 }]} />
        <View style={[styles.skeletonLine, { width: '70%', marginTop: 8 }]} />
      </View>
    </Animated.View>
  );
};

const SkeletonList = () => (
  <View style={{ gap: height * 0.015, marginTop: height * 0.025 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const VendorsFlatList = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, refetch, isRefetching } = useVendors({
    page: 1,
    pageSize: 180,
  });

  const vendors = data?.data ?? [];

  const filteredVendors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter(vendor => {
      const haystack = [
        vendor.title,
        vendor.email,
        vendor.phone,
        vendor.secondaryPhone,
        pickText(vendor.type),
        formatAddress(vendor.address, { capitalize: true }),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [vendors, query]);

  const renderItem = ({ item }: { item: Vendor }) => {
    const address = formatAddress(item.address, { capitalize: true });
    const subtitle = capitalizeLetters(pickText(item.type));
    const categoriesCount = item.categories?.length ?? 0;
    const servicesCount = item.services?.length ?? 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('VendorDetailScreen', { vendorId: item._id })
        }
      >
        <View style={styles.cardTopRow}>
          <View
            style={[styles.avatar, { backgroundColor: getAvatarColor(item._id) }]}
          >
            <Text style={styles.avatarText}>{getInitials(item.title)}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {capitalizeLetters(item.title)}
            </Text>

            <View style={styles.badgeRow}>
              {!!subtitle && (
                <View style={styles.typeBadge}>
                  <Ionicons name="pricetag" size={width * 0.028} color={colors.mantineBlue} />
                  <Text style={styles.typeBadgeText} numberOfLines={1}>
                    {subtitle}
                  </Text>
                </View>
              )}

              {typeof item.vendorPercentage === 'number' && (
                <View style={styles.percentageBadge}>
                  <Text style={styles.percentageText}>{item.vendorPercentage}%</Text>
                </View>
              )}
            </View>
          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.cardBottom}>
          {!!item.phone && (
            <View style={styles.metaRow}>
              <Ionicons name="call-outline" size={width * 0.034} color={colors.gray} />
              <Text style={styles.meta} numberOfLines={1}>
                {item.phone}
              </Text>
            </View>
          )}

          {!!address && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={width * 0.034} color={colors.gray} />
              <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
                {address}
              </Text>
            </View>
          )}

          {(categoriesCount > 0 || servicesCount > 0) && (
            <View style={styles.countRow}>
              {categoriesCount > 0 && (
                <View style={styles.countChip}>
                  <Ionicons name="grid-outline" size={width * 0.03} color={colors.mantineBlue} />
                  <Text style={styles.countChipText}>
                    {categoriesCount} {categoriesCount === 1 ? 'category' : 'categories'}
                  </Text>
                </View>
              )}
              {servicesCount > 0 && (
                <View style={styles.countChip}>
                  <Ionicons name="construct-outline" size={width * 0.03} color={colors.mantineBlue} />
                  <Text style={styles.countChipText}>
                    {servicesCount} {servicesCount === 1 ? 'service' : 'services'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    if (isLoading) {
      return <SkeletonList />;
    }

    if (isError) {
      return (
        <View style={styles.centerState}>
          <View style={styles.errorIconWrap}>
            <Ionicons name="cloud-offline-outline" size={width * 0.12} color={colors.mantineBlue} />
          </View>
          <Text style={styles.emptyTitle}>Couldn't load vendors</Text>
          <Text style={styles.emptyText}>Check your connection and try again.</Text>
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

    if (vendors.length === 0) {
      return (
        <View style={styles.centerState}>
          <View style={styles.errorIconWrap}>
            <Ionicons name="people-outline" size={width * 0.12} color={colors.mantineBlue} />
          </View>
          <Text style={styles.emptyTitle}>No vendors yet</Text>
          <Text style={styles.emptyText}>Add your first vendor to get started.</Text>
          <CustomButton
            text="Add Vendor"
            onPress={() => navigation.navigate('CreateVendor')}
            btnHeight={height * 0.05}
            btnWidth={width * 0.45}
            backgroundColor={colors.mantineBlue}
            textColor={colors.white}
            borderRadius={8}
          />
        </View>
      );
    }

    if (filteredVendors.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons name="search-outline" size={width * 0.14} color={colors.lightGray} />
          <Text style={styles.emptyText}>No vendors match "{query.trim()}".</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredVendors}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={9}
        removeClippedSubviews
        ListHeaderComponent={
          <View style={styles.statCard}>
            <View>
              <Text style={styles.statNumber}>{filteredVendors.length}</Text>
              <Text style={styles.statLabel}>
                {filteredVendors.length === 1 ? 'Vendor' : 'Vendors'}
                {query.trim() ? ' found' : ' total'}
              </Text>
            </View>
          </View>
        }
      />
    );
  };

  const showSearch = !isLoading && !isError && vendors.length > 0;

  return (
    <View style={styles.container}>
      <TopHeader text="Vendors" isBack />

      <View style={styles.content}>
        {showSearch && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={width * 0.045} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search vendors"
              placeholderTextColor={colors.gray}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={width * 0.05} color={colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {renderList()}
      </View>

      <AddFab
        label="Add Vendor"
        onPress={() => navigation.navigate('CreateVendor')}
        bottom={height * 0.035}
        fabWidth={width * 0.4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, paddingHorizontal: width * 0.05 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.025,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    height: height * 0.055,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.black,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
    marginBottom: height * 0.018,
    paddingHorizontal: width * 0.045,
    paddingVertical: height * 0.01,
    borderRadius: 16,
    backgroundColor: colors.mantineBlue + '12',
    borderWidth: 1,
    borderColor: colors.mantineBlue + '25',
  },
  statNumber: {
    fontSize: fontSizes.xl ?? 20,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '800',
    color: colors.black,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
    marginTop: 2,
  },
  centerState: {
    marginTop: height * 0.08,
    alignItems: 'center',
    gap: height * 0.012,
    paddingHorizontal: width * 0.08,
  },
  errorIconWrap: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
    backgroundColor: colors.mantineBlue + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.008,
  },
  emptyTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
    marginBottom: height * 0.012,
  },
  list: { paddingBottom: height * 0.12, gap: height * 0.015 },
  card: {
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.035,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.white,
  },
  info: { flex: 1 },
  name: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: width * 0.015,
    marginTop: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: width * 0.02,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.mantineBlue + '12',
    maxWidth: width * 0.4,
  },
  typeBadgeText: {
    fontSize: fontSizes.xs ?? 11,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  percentageBadge: {
    paddingHorizontal: width * 0.02,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#2B8A3E1A',
  },
  percentageText: {
    fontSize: fontSizes.xs ?? 11,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: '#2B8A3E',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.012,
  },
  cardBottom: { gap: 6 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.015,
  },
  meta: {
    flex: 1,
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  countRow: {
    flexDirection: 'row',
    gap: width * 0.02,
    marginTop: 2,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: width * 0.02,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countChipText: {
    fontSize: fontSizes.xs ?? 11,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.mantineBlue,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.035,
  },
  skeletonBlock: { backgroundColor: colors.border },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
});

export default VendorsFlatList;