import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, CustomTextInput, TopHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { useUsers } from './UsersContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const Users = () => {
  const navigation = useNavigation<Nav>();
  const { users, addUser } = useUsers();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const closeModal = () => {
    setModalVisible(false);
    setName('');
    setEmail('');
    setError('');
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail.includes('@')) {
      setError('Please enter a name and a valid email address.');
      return;
    }

    addUser(trimmedName, trimmedEmail);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <TopHeader text="Add User" isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Transparent add button (centered) */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={width * 0.06} color={colors.darkGreen} />
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>

        {/* Saved user cards */}
        {users.length === 0 ? (
          <Text style={styles.emptyText}>No users added yet.</Text>
        ) : (
          <View style={styles.list}>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate('EditUser', { userId: user.id })
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={width * 0.045}
                  color={colors.gray}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create user modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.overlayInner}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>Add User</Text>

                  <CustomTextInput
                    placeholder="Full Name"
                    placeholderTextColor={colors.black}
                    inputHeight={height * 0.06}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                  <CustomTextInput
                    placeholder="Email Address"
                    placeholderTextColor={colors.black}
                    inputHeight={height * 0.06}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  {error.length > 0 && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}

                  <View style={styles.modalActions}>
                    <CustomButton
                      text="Cancel"
                      btnHeight={height * 0.06}
                      btnWidth={width * 0.36}
                      backgroundColor={colors.white}
                      textColor={colors.darkGreen}
                      borderColor={colors.darkGreen}
                      borderWidth={1}
                      borderRadius={12}
                      onPress={closeModal}
                    />
                    <CustomButton
                      text="Save"
                      btnHeight={height * 0.06}
                      btnWidth={width * 0.36}
                      backgroundColor={colors.darkGreen}
                      textColor={colors.white}
                      borderRadius={12}
                      onPress={handleSave}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    alignSelf: 'center',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkGreen,
    backgroundColor: 'transparent',
  },
  addButtonText: {
    color: colors.darkGreen,
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
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
    gap: height * 0.015,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  userEmail: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
    color: colors.gray,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  overlayInner: {
    width: '100%',
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: width * 0.05,
    gap: height * 0.016,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
    marginBottom: height * 0.005,
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
});

export default Users;
