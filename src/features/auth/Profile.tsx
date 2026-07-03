import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
 
const Profile = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View>
        <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default Profile;