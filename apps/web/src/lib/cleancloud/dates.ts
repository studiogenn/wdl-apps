/**
 * Convert a Date to a CleanCloud Unix timestamp (noon UTC on that day).
 */
export function toCleanCloudTimestamp(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return Math.floor(new Date(Date.UTC(year, month, day, 12, 0, 0)).getTime() / 1000);
}

/**
 * Convert a CleanCloud Unix timestamp back to a Date.
 */
export function fromCleanCloudTimestamp(ts: number): Date {
  return new Date(ts * 1000);
}

/**
 * Convert a Date to CleanCloud date format (yyyy-mm-dd).
 */
export function toCleanCloudDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Convert a 24-hour number (0-23) to a CleanCloud time slot string.
 * e.g., 10 → "10am", 13 → "1pm", 0 → "12am", 12 → "12pm"
 */
export function toCleanCloudTimeSlot(hour: number): string {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}
