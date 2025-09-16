export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatLastSeen(date) {
  if (!date) return "last seen recently";

  const lastSeen = new Date(date);
  const now = new Date();

  // Check for invalid dates
  if (isNaN(lastSeen.getTime())) return "last seen recently";

  // If last seen is in the future, treat as recent
  if (lastSeen > now) return "last seen recently";

  // Compare UTC dates for accurate day determination
  const lastSeenUTC = new Date(lastSeen.getUTCFullYear(), lastSeen.getUTCMonth(), lastSeen.getUTCDate());
  const nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const yesterdayUTC = new Date(nowUTC.getTime() - 24 * 60 * 60 * 1000);

  const isToday = lastSeenUTC.getTime() === nowUTC.getTime();
  const isYesterday = lastSeenUTC.getTime() === yesterdayUTC.getTime();

  if (isToday) {
    return `last seen today at ${lastSeen.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } else if (isYesterday) {
    return `last seen yesterday at ${lastSeen.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } else {
    return `last seen ${lastSeen.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: lastSeen.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })} at ${lastSeen.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  }
}
