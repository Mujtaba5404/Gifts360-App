import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AppUser,
  getUserName,
  getUserRoleTitle,
  useUsers,
} from '../../api/useUsers';
import { fontFamily } from '../../assets/Fonts';
import { AddFab, CustomButton, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { colors } from '../../utils/colors';
import { getAvatarColor, getInitials } from '../../utils/display';
import { fontSizes } from '../../utils/fontSizes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_META = {
  active: { label: 'Active', color: '#2B8A3E', bg: '#E8F7EC' },
  inactive: { label: 'Inactive', color: '#B54708', bg: '#FFF4E5' },
};

const PAGE_SIZE = 100;

const Users = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, error, refetch, isRefetching } = useUsers({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const users = data?.data ?? [];
  const usersCount = data?.meta?.totalCount ?? 0;


  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(user => {
      const haystack = [
        getUserName(user),
        user.email,
        getUserRoleTitle(user.role),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [users, query]);

  const renderItem = ({ item }: { item: AppUser }) => {
    const statusMeta = item.isActive ? STATUS_META.active : STATUS_META.inactive;
    const brandCount = item.brands?.length ?? 0;
    const displayName = getUserName(item) || 'Unnamed user';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('EditUser', { userId: item._id })}
      >
        <View style={styles.cardTop}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: getAvatarColor(item._id) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.userName} numberOfLines={1}>
              {capitalizeLetters(displayName)}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {item.email}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
            <Text style={[styles.statusText, { color: statusMeta.color }]}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBottom}>
          <View style={styles.metaRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={width * 0.032}
              color={colors.gray}
            />
            <Text style={styles.meta}>
              {getUserRoleTitle(item.role) || 'No role'}
            </Text>
          </View>

          {brandCount > 0 && (
            <View style={styles.metaRow}>
              <Ionicons
                name="pricetags-outline"
                size={width * 0.032}
                color={colors.gray}
              />
              <Text style={styles.meta}>
                {brandCount} {brandCount === 1 ? 'brand' : 'brands'}
              </Text>
            </View>
          )}

          {item.usesBrandAliases && (
            <View style={styles.metaRow}>
              <Ionicons
                name="swap-horizontal-outline"
                size={width * 0.032}
                color={colors.gray}
              />
              <Text style={styles.meta}>Aliases</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          <Ionicons
            name="cloud-offline-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>Failed to load users.</Text>
          {/* Asal server message dikhao — warna status code debugging mein atak jati hai. */}
          {!!error?.message && (
            <Text style={styles.errorDetail}>{error.message}</Text>
          )}
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

    if (users.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="person-add-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>No users added yet.</Text>
        </View>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="search-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>
            No users match "{query.trim()}".
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={<Text>{usersCount} user(s)</Text>}

      />
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Users" isBack />

      <View style={styles.content}>
        {!isLoading && !isError && users.length > 0 && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={width * 0.045} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name, email or role"
              placeholderTextColor={colors.gray}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={width * 0.05}
                  color={colors.gray}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {renderList()}
      </View>

      <AddFab
        label="Add User"
        onPress={() => navigation.navigate('CreateUser')}
        bottom={height * 0.065}
        fabWidth={width * 0.4}
      />
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
  },
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
  centerState: {
    marginTop: height * 0.06,
    alignItems: 'center',
    gap: height * 0.02,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  errorDetail: {
    textAlign: 'center',
    paddingHorizontal: width * 0.05,
    color: colors.gray,
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
  },
  list: {
    marginTop: height * 0.025,
    paddingBottom: height * 0.12,
    gap: height * 0.015,
  },
  card: {
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.035,
  },
  avatar: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  userEmail: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  statusBadge: {
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: 20,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.014,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: width * 0.045,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.012,
  },
  meta: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default Users;
