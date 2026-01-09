# common-ui-auth

UI utilities and tooling to manage authentication.

## Usage

### Configuration

```ts
import { createAuthenticationConfig } from "@seij/common-ui-auth";

const config = createAuthenticationConfig({
  authority: "https://oidc.mydomain.lan/realms/myrealm",
  client_id: "your client id",
  redirect_uri: yourAppBaseUrl + "/authentication-callback",
});
```

### Usage with APIs

Now, you can configure your API headers so send stored API token with headers.

```ts
import { ConnectionConfig, defaultConnection } from "@seij/common-services";

const apiConfig: ConnectionConfig = {
  apiBaseUrl: "/api/myapibaseurl",
  getApiAccessToken: authenticationConfig.getCurrentAccessToken,
};
defaultConnection.reconfigure(apiConfig);
```

### Usage with React

Place a provider around the area where authentication is needed. This will
provide
hooks to know connected (or not) user, as well as methods to signIn() or
signOut()
user.

```tsx
import { AuthenticationProvider, useAuthentication } from "@seij/common-ui-auth";

export function App() {
  return (
    <AuthenticationProvider {...config}>
      <MyScreen />
    </AuthenticationProvider>
  );
}

export function MyScreen() {
  const authentication = useAuthentication();
  return (
    <div>
      <div>Is authenticated: {authentication.isAuthenticated}</div>
      <div>Is loading: {authentication.isLoading}</div>
      <div>Is error: {authentication.isError}</div>
      <div>Error: {authentication.error}</div>
      <div>User display name: {authentication.userDisplayName}</div>
      <div>
        <button onClick={() => authentication.signIn()}>Sign in</button>
        <button onClick={() => authentication.signOut()}>Sign out</button>
      </div>
    </div>
  );
}
```

We provide Views to display common displays depending on user state.

- `AuthenticationCallbackView` that you should bind to /authentication-callback
- `AuthenticationLoginView` that you should bind to /authentication-login
- `AuthenticationLogoutView` that you should bind to /authentication-logout
- `AuthenticationStatusView` that you should display when user tries to access a
  page that required authentication. Displays the current status of
  authentication process and, if user is not authenticated, a message to help
  him do so.

## Usage with @seij/common-ui's ApplicationShell

We also provide `ApplicationShellSecured`, an extension to `@seij/common-ui`'s
`ApplicationShell` that

- binds user status to the Shell (displays username, loading status, buttons to
  sign in/out)
- protects the main area if user displaying `NotAuthenticatedView` when
  necessary
- filters out navigation items (the menu items) to remove all those not
  permitted by the current user status or roles

## Paths

We provide standard paths for login, logout and callback pages:

- `AuthenticationPaths.callback`
- `AuthenticationPaths.login`
- `AuthenticationPaths.logout`

## Internationalization

Uses `common-ui` default internationalization features and plugs its translations
as a namespace.
