import { isEmpty, isString } from "lodash-es";
import { User } from "oidc-client-ts";
import { AuthState, useAuth } from "react-oidc-context";

export interface OIDCBaseConfig {
  authority: string;
  client_id: string;
  redirect_uri: string;
  scope?: string;
}

/**
 * Those parameters match [oidc-client-ts/OidcClientSettings]
 * and [react-oidc-context/AuthProviderProps]
 */
export interface AuthenticationConfig {
  /** The URL of the OIDC/OAuth2 provider */
  authority: string;
  /**
   * Your client application's identifier as registered with the OIDC/OAuth2
   *
   * Implementation notes: from [oidc-client-ts]
   **/
  client_id: string;
  /**
   * The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider
   *
   * Implementation notes: from [oidc-client-ts]
   */
  redirect_uri: string;
  /**
   * The scope being requested from the OIDC/OAuth2 provider (default: "openid")
   *
   * Implementation notes: from [oidc-client-ts]
   */
  scope?: string;
  /**
   * On sign in callback hook. Can be a async function.
   * Here you can remove the code and state parameters from the url when you are redirected from the authorize page.
   *
   * ```jsx
   * const onSigninCallback = (_user: User | undefined): void => {
   *     window.history.replaceState(
   *         {},
   *         document.title,
   *         window.location.pathname
   *     )
   * }
   * ```
   */
  onSigninCallback: (_user: User | void) => void;
  /**
   * Gets the current access token. For usage in APIs.
   *
   * Implementation notes: specific method from this module that gets the token from the localStorage, for usage outside
   * a React context, used for API calls.
   */
  getCurrentAccessToken: () => string | null;
}

/**
 * Creates an OpenIdConnect configuration
 */
export function createAuthenticationConfig(env: OIDCBaseConfig): AuthenticationConfig {
  if (!isString(env.authority) || isEmpty(env.authority))
    throw Error(`OIDC configuration error: 'authority' property must be a non-empty string. Found: ${env.authority}`);
  if (!isString(env.client_id) || isEmpty(env.client_id))
    throw Error(`OIDC configuration error: 'client_id' property must be a non-empty string. Found: ${env.client_id}`);
  if (!isString(env.redirect_uri) || isEmpty(env.redirect_uri))
    throw Error(
      `OIDC configuration error: 'redirect_uri' property must be a non-empty string. Found: ${env.redirect_uri}`,
    );
  const config: AuthenticationConfig = {
    authority: env.authority,
    client_id: env.client_id,
    redirect_uri: env.redirect_uri,
    scope: env.scope,
    onSigninCallback: (_user: User | void): void => {
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    getCurrentAccessToken: () => getCurrentAccessToken(env.authority, env.client_id)?.accessToken,
  };
  return config;
}

interface CurrentAuthentication {
  /**
   * Permet de savoir si l'utilisateur est actuellement authentifié
   */
  isAuthenticated: boolean;
  /**
   * Indique si une authentication est en cours
   */
  isLoading: boolean;
  /**
   * Indique si l'authentification a été en erreur
   */
  isError: boolean;
  /**
   * Message d'erreur si il y en a un
   */
  error: Error | null;
  /**
   * TODO voir si on peut s'en débarrasser
   */
  activeNavigator: AuthState["activeNavigator"] | null;
  /**
   * Issuer: qui a émis le user. N'est présent que si l'authentification a réussi
   */
  issuer: string | null;
  /**
   * Subject: "sub" du token
   */
  subject: string | null;
  /**
   * Nom de l'utilisateur à afficher
   */
  userDisplayName: string | "";
  /**
   * Méthode pour commencer le process de sign-in
   */
  signIn(): void;
  /**
   * Méthode pour commencer le process de sign-out
   */
  signOut(): void;
}

export function getCurrentAccessToken(authority: string, clientId: string): { accessToken: string | null } {
  const localStorageItemKey = `oidc.user:${authority}:${clientId}`;
  const oidcStorage = sessionStorage.getItem(localStorageItemKey);
  if (!oidcStorage) {
    return {
      accessToken: null,
    };
  }

  const user = User.fromStorageString(oidcStorage);
  return {
    accessToken: user?.access_token ?? null,
  };
}

/**
 * Hook qui permet d'avoir les éléments d'authentification en cours et
 * les méthodes pour agir dessus.
 * @returns
 */
export function useAuthentication(): CurrentAuthentication {
  const auth = useAuth();
  return {
    isAuthenticated: auth?.isAuthenticated === true,
    isLoading: auth.isLoading,
    isError: auth.error !== null && auth.error !== undefined,
    error: auth.error ?? null,
    activeNavigator: auth.activeNavigator ?? null,
    userDisplayName: auth.user?.profile?.name ?? "",
    issuer: auth.user?.profile?.iss ?? null,
    subject: auth.user?.profile?.sub ?? null,
    signOut: () => {
      auth.removeUser();
    },
    signIn: () => {
      auth.signinRedirect();
    },
  };
}
