export function getUrgencyState(followUpDateStr, status) {
  if (status !== "active") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const followUp = new Date(followUpDateStr);

  if (followUp < today) {
    return "OVERDUE";
  } else if (followUp >= today && followUp < tomorrow) {
    return "DUE_TODAY";
  } else {
    return "ON_TRACK";
  }
}

export function getDaysSince(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
