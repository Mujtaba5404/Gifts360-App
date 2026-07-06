import React from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { fontFamily } from '../../assets/Fonts';
import images from '../../assets/Images';
import { TopHeader } from '../../components';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';

const Home = () => {
  return (
    <View style={{ flex: 1, marginBottom: height * 0.07 }}>
      <TopHeader isMenu isProfile notification />

      <ImageBackground source={images.background} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={styles.welcome}>
            Welcome Mujtaba
          </Text>

          <View style={{ height: height * 0.08 }} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    left: width * 0.05,
  },
});

export default Home;