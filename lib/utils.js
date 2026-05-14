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

export function getStatusColor(status, urgency) {
  if (status === 'rejected') return '#C0706A';
  if (status === 'responded') return '#7CCDE5';
  if (status === 'archived') return '#676386';
  if (status === 'active') {
    if (urgency === 'OVERDUE') return '#DDDE68';
    if (urgency === 'DUE_TODAY') return '#DA935D';
    return '#A5B2EB';
  }
  return '#A5B2EB';
}
