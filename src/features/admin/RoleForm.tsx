import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fontFamily } from '../../assets/Fonts';
import { CustomButton, CustomTextInput } from '../../components';
import { height, width } from '../../utils';
import { colors } from '../../utils/colors';
import { fontSizes } from '../../utils/fontSizes';
import { Checkbox, Dropdown, Field } from './formControls';
import { ResourcePermissions } from './RolesContext';

export interface RoleFormValues {
  title: string;
  scope: string;
  indexPath: string;
  permissions: Record<string, ResourcePermissions>;
}

interface RoleFormProps {
  initialValues?: Partial<RoleFormValues>;
  submitLabel: string;
  onSubmit: (values: RoleFormValues) => void;
}

const SCOPE_OPTIONS = ['Global', 'Brand', 'Organization'];
const PERMISSION_RESOURCES = ['BoxSpecification', 'BoxStyle', 'Brand'];
const PERMISSION_ACTIONS: { key: keyof ResourcePermissions; label: string }[] =
  [
    { key: 'create', label: 'Create' },
    { key: 'view', label: 'View' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' },
  ];

const buildPermissions = (
  initial?: Record<string, ResourcePermissions>,
): Record<string, ResourcePermissions> =>
  PERMISSION_RESOURCES.reduce((acc, resource) => {
    acc[resource] = initial?.[resource] ?? {
      create: false,
      view: false,
      update: false,
      delete: false,
    };
    return acc;
  }, {} as Record<string, ResourcePermissions>);

const RoleForm = ({ initialValues, submitLabel, onSubmit }: RoleFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [scope, setScope] = useState(initialValues?.scope ?? '');
  const [indexPath, setIndexPath] = useState(initialValues?.indexPath ?? '');
  const [permissions, setPermissions] = useState(
    buildPermissions(initialValues?.permissions),
  );
  const [error, setError] = useState('');

  const togglePermission = (
    resource: string,
    action: keyof ResourcePermissions,
  ) => {
    setPermissions(prev => ({
      ...prev,
      [resource]: { ...prev[resource], [action]: !prev[resource][action] },
    }));
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedIndexPath = indexPath.trim();

    if (!trimmedTitle) {
      return setError('Title is required.');
    }
    if (!scope) {
      return setError('Please select a scope.');
    }
    if (!trimmedIndexPath) {
      return setError('Index Path is required.');
    }

    onSubmit({
      title: trimmedTitle,
      scope,
      indexPath: trimmedIndexPath,
      permissions,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Title" required>
          <CustomTextInput
            placeholder="Enter title"
            placeholderTextColor={colors.gray}
            inputHeight={height * 0.06}
            value={title}
            onChangeText={setTitle}
          />
        </Field>

        <Field label="Scope" required>
          <Dropdown
            placeholder="Select scope"
            options={SCOPE_OPTIONS}
            selected={scope ? [scope] : []}
            onChange={values => setScope(values[0] ?? '')}
          />
        </Field>

        <Field label="Index Path" required>
          <CustomTextInput
            placeholder="Enter index path"
            placeholderTextColor={colors.gray}
            inputHeight={height * 0.06}
            value={indexPath}
            onChangeText={setIndexPath}
            autoCapitalize="none"
          />
        </Field>

        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={styles.permissionsCard}>
          {PERMISSION_RESOURCES.map(resource => (
            <View key={resource} style={styles.resourceBlock}>
              <Text style={styles.resourceTitle}>{resource}</Text>
              <View style={styles.permGrid}>
                {PERMISSION_ACTIONS.map(action => (
                  <View key={action.key} style={styles.permItem}>
                    <Checkbox
                      label={action.label}
                      checked={permissions[resource][action.key]}
                      onToggle={() => togglePermission(resource, action.key)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

        <CustomButton
          text={submitLabel}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.mantineBlue}
          textColor={colors.white}
          borderRadius={12}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.05,
    gap: height * 0.02,
  },
  sectionTitle: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '600',
    color: colors.black,
  },
  permissionsCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: width * 0.04,
    gap: height * 0.02,
  },
  resourceBlock: {
    gap: height * 0.012,
  },
  resourceTitle: {
    fontSize: fontSizes.sm2,
    fontFamily: fontFamily.UrbanistBold,
    fontWeight: '700',
    color: colors.black,
  },
  permGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: height * 0.012,
  },
  permItem: {
    width: '50%',
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.UrbanistMedium,
  },
});

export default RoleForm;
