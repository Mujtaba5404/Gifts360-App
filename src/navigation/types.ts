/**
 * Navigation param lists for the app's navigators.
 * Keep route types here so screens can import them without importing the
 * navigator components (avoids circular imports).
 */
export type RootStackParamList = {
  SignInEmail: undefined;
  Home: undefined;
  Users: undefined;
  CreateUser: undefined;
  EditUser: { userId: string };
  Roles: undefined;
  CreateRole: undefined;
  EditRole: { roleId: string };
  ChangePasswordScreen: undefined;
  CreateExpenses: undefined;
  EditExpenses: { expense: Expense };
  ExpensesFlatList: undefined;
};
