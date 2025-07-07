export function timeAgo(ts: number | string | null | undefined): string {
  if (!ts) return "";
  const now = Date.now();
  const t = typeof ts === "string" ? Number(ts) : ts;
  const diff = now - t;
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(diff / (3600 * 1000));
  const day = Math.floor(diff / (24 * 3600 * 1000));
  if (day > 0) return `${day}일 전`;
  if (hour > 0) return `${hour}시간 전`;
  if (min > 0) return `${min}분 전`;
  return "방금 전";
}

export function formatDuration(sec: number): string {
  const min = Math.round(sec / 60);
  return `${min}분`;
}
