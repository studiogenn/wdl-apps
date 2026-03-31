import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type PhoneConfirmation = FirebaseAuthTypes.ConfirmationResult;

export async function sendPhoneVerification(
  phoneNumber: string
): Promise<PhoneConfirmation> {
  const e164 = phoneNumber.startsWith("+") ? phoneNumber : `+1${phoneNumber.replace(/\D/g, "")}`;
  return auth().signInWithPhoneNumber(e164);
}

export async function confirmVerificationCode(
  confirmation: PhoneConfirmation,
  code: string
): Promise<FirebaseAuthTypes.UserCredential | null> {
  return confirmation.confirm(code);
}

export async function signOut(): Promise<void> {
  return auth().signOut();
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

export async function getIdToken(): Promise<string | null> {
  const user = auth().currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void
): () => void {
  return auth().onAuthStateChanged(callback);
}
