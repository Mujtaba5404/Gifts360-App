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
import { formatDisplayDate } from './types';
import { PettyCash, usePettyCash } from '../../api/usePettyCash';
import formatAmount from '../../utils/formatAmount';
import capitalizeLetters from '../../utils/capitalizeLetters';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PettyCashFlatList = () => {
  const navigation = useNavigation<Nav>();

  const { data, isLoading, isError, refetch, isFetching } = usePettyCash({
    page: 1,
    pageSize: 100,
    sort: '-date',
  });
  console.log(data)

  const rows = data?.data ?? [];

  const renderItem = ({ item }: { item: PettyCash }) => {
    const isDebit = item.amount < 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('EditPettyCash', { entry: item })}
      >
        <View style={styles.row}>
          <View style={styles.leftCol}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {capitalizeLetters(item.description)}
            </Text>

            {item.user?.name ? (
              <Text style={styles.userText} numberOfLines={1}>
                {capitalizeLetters(item.user.name)}
              </Text>
            ) : null}

            {item.account?.title ? (
              <View style={styles.accountPill}>
                <Text style={styles.accountPillText} numberOfLines={1}>
                  {capitalizeLetters(item.account.title)}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.rightCol}>
            <Text
              style={[
                styles.amount,
                { color: isDebit ? colors.mantineBlue : colors.black },
              ]}
            >
              {isDebit ? '- ' : '+ '}
              {formatAmount(Math.abs(item.amount))}
            </Text>

            <Text style={styles.balance}>
              Bal: Rs {item.balance.toLocaleString()}
            </Text>

            <Text style={styles.rightDate}>
              {formatDisplayDate(new Date(item.date))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Petty Cash" isBack />

      <View style={styles.content}>
        <CustomButton
          text="Add Petty Cash"
          onPress={() => navigation.navigate('CreatePettyCash')}
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

        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.mantineBlue}
          />
        ) : isError ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyText}>
              Failed to load petty cash. Pull to retry.
            </Text>
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
        ) : rows.length === 0 ? (
          <Text style={styles.emptyText}>No petty cash added yet.</Text>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            refreshing={isFetching}
            onRefresh={refetch}
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
  titleCol: {
    flexShrink: 1,
    gap: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  loader: {
    marginTop: height * 0.05,
  },
  centerBox: {
    marginTop: height * 0.05,
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
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flexShrink: 1,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  amount: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  accountPill: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.mantineBlue + '1A',
  },
  accountPillText: {
    fontSize: fontSizes.xs ?? 12,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.mantineBlue,
  },
  userText: {
    fontSize: fontSizes.xs ?? 16,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  leftCol: {
    flex: 1,
    gap: 4,
  },

  rightCol: {
    width: width * 0.3,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  rightDate: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  balance: {
    fontSize: fontSizes.xs ?? 14,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
});

export default PettyCashFlatList;
