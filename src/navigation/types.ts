/**
 * Navigation param lists for the app's navigators.
 * Keep route types here so screens can import them without importing the
 * navigator components (avoids circular imports).
 */
export type RootStackParamList = {
  SignInEmail: undefined;
  Home: undefined;
  Users: undefined;
  EditUser: { userId: string };
};
