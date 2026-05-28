# BusinessLayer authentication

BusinessLayer contains the authentication flow used by the API:

- `UserActions.RegisterUserActionExecution` hashes new user passwords with BCrypt before saving them.
- `UserActions.LoginUserActionExecution` validates credentials by loading the user by email and verifying the password hash with BCrypt.
- `AuthActions.LoginActionExecution` creates the authentication response after successful credential validation.
- `AuthActions.GenerateToken` issues JWT tokens with user identity and role claims.
- `AuthActions.ValidateJwtTokenActionExecution` validates JWT tokens with issuer, audience, lifetime and signing key checks.

The public entry points are exposed through `IAuthAction` and implemented by `AuthService`.
