import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { AddFab, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import capitalizeLetters from '../../utils/capitalizeLetters';
import { colors } from '../../utils/colors';
import { getAvatarColor, getInitials } from '../../utils/display';
import { fontSizes } from '../../utils/fontSizes';
import { Role, useRoles } from './RolesContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Har role ke permissions ka khulasa — kitne resources par access hai aur
 * kul kitni actions allowed hain.
 */
const summarizePermissions = (role: Role) => {
  const entries = Object.values(role.permissions ?? {});
  const grantedActions = entries.reduce(
    (sum, resource) => sum + Object.values(resource).filter(Boolean).length,
    0,
  );
  const resourcesWithAccess = entries.filter(resource =>
    Object.values(resource).some(Boolean),
  ).length;

  return { grantedActions, resourcesWithAccess };
};

const Roles = () => {
  const navigation = useNavigation<Nav>();
  const { roles } = useRoles();
  const [query, setQuery] = useState('');

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(role => {
      const haystack = [role.title, role.scope]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [roles, query]);

  const renderItem = ({ item }: { item: Role }) => {
    const { grantedActions, resourcesWithAccess } = summarizePermissions(item);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('EditRole', { roleId: item.id })}
      >
        <View style={styles.cardTop}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: getAvatarColor(item.id) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(item.title)}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.roleTitle} numberOfLines={1}>
              {capitalizeLetters(item.title)}
            </Text>
            {!!item.scope && (
              <Text style={styles.roleScope} numberOfLines={1}>
                {item.scope}
              </Text>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={width * 0.045}
            color={colors.gray}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Ionicons
                name="albums-outline"
                size={width * 0.03}
                color={colors.mantineBlue}
              />
              <Text style={styles.statLabel}>Resources</Text>
            </View>
            <Text style={styles.statValue}>{resourcesWithAccess}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Ionicons
                name="key-outline"
                size={width * 0.03}
                color={colors.mantineBlue}
              />
              <Text style={styles.statLabel}>Permissions</Text>
            </View>
            <Text style={styles.statValue}>{grantedActions}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    if (roles.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="shield-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>No roles added yet.</Text>
        </View>
      );
    }

    if (filteredRoles.length === 0) {
      return (
        <View style={styles.centerState}>
          <Ionicons
            name="search-outline"
            size={width * 0.14}
            color={colors.lightGray}
          />
          <Text style={styles.emptyText}>
            No roles match "{query.trim()}".
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredRoles}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Roles & Permissions" isBack />

      <View style={styles.content}>
        {roles.length > 0 && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={width * 0.045} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search role or scope"
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
        label="Add Role"
        onPress={() => navigation.navigate('CreateRole')}
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
  roleTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  roleScope: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: height * 0.014,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  statValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  statDivider: {
    width: 1,
    height: height * 0.03,
    backgroundColor: colors.border,
    marginHorizontal: width * 0.03,
  },
});

export default Roles;
