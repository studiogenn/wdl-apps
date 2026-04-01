const KNOWN_ERRORS: ReadonlyArray<readonly [string, string]> = [
  ["Invalid API Token", "Service temporarily unavailable. Please try again."],
  ["Customer already exists", "An account with this email already exists. Please log in instead."],
  ["Invalid email", "Please enter a valid email address."],
  ["Invalid phone number", "Please enter a valid phone number."],
  ["No route found", "Sorry, we don't serve your area yet."],
  ["Invalid promo code", "That promo code is invalid or has expired."],
  ["Promo code already used", "This promo code has already been used."],
  ["No available slots", "No time slots are available for this date. Please choose another day."],
  ["Invalid password", "Incorrect email or password."],
  ["Customer not found", "No account found with that email address."],
];

export function getReadableError(cleancloudError: string): string {
  const lower = cleancloudError.toLowerCase();
  for (let i = 0; i < KNOWN_ERRORS.length; i++) {
    const entry = KNOWN_ERRORS[i];
    if (entry && lower.includes(entry[0].toLowerCase())) {
      return entry[1];
    }
  }
  return "Something went wrong. Please try again.";
}
