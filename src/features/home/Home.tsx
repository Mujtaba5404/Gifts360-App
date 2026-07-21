import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { useSelector } from 'react-redux';
import { fontFamily } from '../../assets/Fonts';
import { SideDrawer, TopHeader } from '../../components';
import PnlCard from '../../components/PnlCard';
import { RootState } from '../../redux/store';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { getDisplayName } from '../../utils/user';

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = useSelector((state: RootState) => state.role.user.name);
  const userEmail = useSelector((state: RootState) => state.role.userEmail);
  const displayName = getDisplayName(user, userEmail);

  return (
    <View style={{ flex: 1, marginBottom: height * 0.07 }}>
      <TopHeader
        isMenu
        isProfile
        notification
        onMenuPress={() => setDrawerOpen(true)}
      />
      <SideDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />


      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome} numberOfLines={1}>
          Welcome {displayName}
        </Text>

        <PnlCard />


        <View style={{ height: height * 0.08 }} />
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.lg2,
    fontWeight: '600',
    color: colors.black,
    left: width * 0.05,
  },
});

export default Home;
