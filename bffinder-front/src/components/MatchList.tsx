import { timeAgo, formatDuration } from "./TimeAgo";

type Match = {
  matchId: string;
  gameCreation: number;
  gameEndTimestamp: number;
  gameDuration: number;
  win: boolean;
};

export default function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <div
          key={m.matchId}
          className="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="font-medium text-gray-800 text-sm truncate max-w-[200px]">
              {m.matchId}
            </div>
            <span
              className={
                "text-xs font-medium px-3 py-1 rounded-lg " +
                (m.win
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-red-100 text-red-700 border border-red-200")
              }
            >
              {m.win ? "승리" : "패배"}
            </span>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div className="mb-1">
              플레이시간: {formatDuration(m.gameDuration)}
            </div>
            <div>종료: {timeAgo(m.gameEndTimestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
