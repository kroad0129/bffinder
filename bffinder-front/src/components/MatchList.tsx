import { timeAgo, formatDuration } from "./TimeAgo";

type Match = {
  matchId: string;
  gameCreation: number; // ms 단위 (유닉스 타임스탬프)
  gameEndTimestamp: number; // ms 단위 (유닉스 타임스탬프)
  gameDuration: number; // 초 단위
  win: boolean;
};

export default function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div className="space-y-2">
      {matches.map((m) => (
        <div
          key={m.matchId}
          className="flex justify-between items-center p-3 border rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="font-semibold">{m.matchId}</div>
            <span
              className={
                "text-xs font-bold px-2 py-0.5 rounded " +
                (m.win
                  ? "bg-blue-100 text-blue-600 border border-blue-200"
                  : "bg-red-100 text-red-600 border border-red-200")
              }
            >
              {m.win ? "승리" : "패배"}
            </span>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>플레이시간: {formatDuration(m.gameDuration)}</div>
            <div>종료: {timeAgo(m.gameEndTimestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
