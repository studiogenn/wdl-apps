/**
 * Maps plan configurations to Stripe Price IDs.
 *
 * Create these products/prices in Stripe Dashboard, then paste the price IDs here.
 * Each key is: `${bags}bag_${freq}` or `${bags}bag_${freq}_student`
 *
 * Example Stripe product: "WDL Subscription - 1 Bag Weekly"
 *   → Create a recurring price of $30.99/month → paste that price ID below.
 */
export const STRIPE_PRICE_IDS: Record<string, string> = {
  // Standard plans
  "1bag_weekly": "",     // $30.99/bag × 4 pickups = $123.96/mo
  "1bag_biweekly": "",   // $30.99/bag × 2 pickups = $61.98/mo
  "2bag_weekly": "",     // $30.99/bag × 8 = $247.92/mo
  "2bag_biweekly": "",   // $30.99/bag × 4 = $123.96/mo
  "3bag_weekly": "",     // $30.99/bag × 12 = $371.88/mo
  "3bag_biweekly": "",   // $30.99/bag × 6 = $185.94/mo
  "4bag_weekly": "",     // $30.99/bag × 16 = $495.84/mo
  "4bag_biweekly": "",   // $30.99/bag × 8 = $247.92/mo

  // Student plans
  "1bag_weekly_student": "",     // $24.99/bag × 4 = $99.96/mo
  "1bag_biweekly_student": "",   // $24.99/bag × 2 = $49.98/mo
  "2bag_weekly_student": "",
  "2bag_biweekly_student": "",
};

export function getPriceId(bags: number, freq: "weekly" | "biweekly", isStudent: boolean): string | null {
  const key = `${bags}bag_${freq}${isStudent ? "_student" : ""}`;
  const id = STRIPE_PRICE_IDS[key];
  return id || null;
}
