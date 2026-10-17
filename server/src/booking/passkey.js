// Passkey port. The real check runs on the vault page (WebAuthn, Face ID or
// fingerprint). The app only asks the port and never confirms in-app.
export function createDenyingPasskey() {
  return {
    async confirm() {
      return false;
    },
  };
}
