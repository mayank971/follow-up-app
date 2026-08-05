/**
 * Dynamic Date Formatting for Follow Up App
 * Rule Specifications:
 * - Today or 1 day remaining: "today"
 * - 2 days remaining: "tomorrow"
 * - >2 days & <=7 days: "3d", "4d", "5d", "6d"
 * - >7 days & <=14 days: "1w", "2w"
 * - >14 days: Month & Date (e.g., "Oct 24")
 * - Past date: "Overdue • [Month Date]"
 */
export function formatFollowupDate(isoDateString: string): string {
  if (!isoDateString) return '';

  const targetDate = new Date(isoDateString);
  const now = new Date();

  // Reset time portions to start of day for precise calendar day difference
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetDay.getTime() - todayDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const month = targetDate.toLocaleString('en-US', { month: 'short' });
    const day = targetDate.getDate();
    return `Overdue • ${month} ${day}`;
  }

  if (diffDays === 0) {
    return 'today';
  }

  if (diffDays === 1) {
    return 'tomorrow';
  }

  if (diffDays >= 2 && diffDays <= 6) {
    // 2 days remaining -> 2d, 3 days -> 3d, etc. (diffDays + 1 for day index or diffDays)
    // Note: prompt says: "1 day remaining = today, 2 days remaining = tomorrow, >2 days & <=7 days = 3d, 4d, 5d, 6d"
    // So diffDays = 2 is "tomorrow" or "3d". Let's handle:
    // diffDays = 1 (tomorrow), diffDays = 2 => "3d", diffDays = 3 => "4d", etc.
    return `${diffDays + 1}d`;
  }

  if (diffDays >= 7 && diffDays <= 13) {
    const weeks = Math.ceil(diffDays / 7);
    return `${weeks}w`;
  }

  // > 14 days or fallthrough
  const month = targetDate.toLocaleString('en-US', { month: 'short' });
  const day = targetDate.getDate();
  return `${month} ${day}`;
}

/**
 * Full readable date & time string for client detail view
 */
export function formatFullDateTime(isoDateString: string): string {
  if (!isoDateString) return '';
  const d = new Date(isoDateString);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
