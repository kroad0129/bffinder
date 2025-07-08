"use client";
import { useEffect, useState } from "react";
import MatchList from "@/components/MatchList";
import { timeAgo } from "@/components/TimeAgo";

type Match = {
  matchId: string;
  gameCreation: number;
  gameEndTimestamp: number;
  gameDuration: number;
  win: boolean;
};

export default function DetailPage({
  searchParams,
}: {
  searchParams: { puuid: string };
}) {
  const puuid = searchParams.puuid;

  const [nickname, setNickname] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [lastGameEnd, setLastGameEnd] = useState<number | null>(null);
  const [isInGame, setIsInGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!puuid) return;
    (async () => {
      setLoading(true);
      setError(null);

      // 닉네임 fetch
      try {
        const res = await fetch(
          `http://localhost:8080/api/account/puuid?puuid=${puuid}`
        );
        if (res.ok) {
          const data = await res.json();
          setNickname(data.gameName); // 닉네임만 저장
        }
      } catch (e) {
        // 에러 핸들링 필요하면 작성
      }

      // in-game 여부
      const igRes = await fetch(
        `http://localhost:8080/api/match/in-game?puuid=${puuid}`
      );
      if (igRes.ok) {
        const data = await igRes.json();
        setIsInGame(data.inGame);
      }

      // 최근 매치 리스트
      const listRes = await fetch(
        `http://localhost:8080/api/match/list?puuid=${puuid}&count=10`
      );
      if (listRes.ok) {
        const { matches } = await listRes.json();
        setMatches(matches);
        if (matches && matches.length > 0) {
          setLastGameEnd(matches[0].gameEndTimestamp);
        }
      }
      setLoading(false);
    })();
  }, [puuid]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
        {/* 상단 정보 */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold">
            {nickname ? nickname : puuid}
          </span>
          {loading ? (
            <span className="ml-4 text-gray-400 text-sm">불러오는 중...</span>
          ) : error ? (
            <span className="ml-4 text-red-500 text-sm">{error}</span>
          ) : isInGame ? (
            <span className="ml-4 px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
              게임중
            </span>
          ) : lastGameEnd ? (
            <span className="ml-4 text-gray-500 text-sm font-semibold">
              마지막 플레이 시간: {timeAgo(lastGameEnd)}
            </span>
          ) : (
            <span className="ml-4 text-gray-400 text-sm">정보 없음</span>
          )}
        </div>
        {/* 매치 리스트 */}
        <div className="mb-2 text-lg font-semibold">최근 매칭 기록</div>
        {loading ? (
          <div>불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500 text-sm mt-4">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-gray-500 text-sm mt-4">
            매칭 기록이 없습니다.
          </div>
        ) : (
          <MatchList matches={matches} />
        )}
      </div>
    </main>
  );
}
