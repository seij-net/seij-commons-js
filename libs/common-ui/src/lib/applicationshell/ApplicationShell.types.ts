export interface UserStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
  userName: string | null;
  onClickSignIn: () => void;
  onClickSignOut: () => void;
}
