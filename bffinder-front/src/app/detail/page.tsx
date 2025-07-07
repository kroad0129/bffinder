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
  searchParams: { name: string; tag: string };
}) {
  const name = searchParams.name;
  const tag = searchParams.tag;

  const [puuid, setPuuid] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [lastGameEnd, setLastGameEnd] = useState<number | null>(null);
  const [isInGame, setIsInGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name || !tag) return;
    (async () => {
      setLoading(true);
      setError(null);
      setPuuid(null);
      setMatches([]);
      setIsInGame(false);
      setLastGameEnd(null);

      // 1) puuid 조회
      const accRes = await fetch(
        `http://localhost:8080/api/account/info?gameName=${encodeURIComponent(
          name
        )}&tagLine=${encodeURIComponent(tag)}`
      );
      if (!accRes.ok) {
        setError("해당 소환사를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }
      const { puuid } = await accRes.json();
      setPuuid(puuid);

      // 2) in-game 여부
      const igRes = await fetch(
        `http://localhost:8080/api/match/in-game?puuid=${puuid}`
      );
      if (igRes.ok) {
        const data = await igRes.json();
        setIsInGame(data.inGame);
      }

      // 3) 최근 매치 리스트
      const listRes = await fetch(
        `http://localhost:8080/api/match/list?puuid=${puuid}&count=20`
      );
      if (listRes.ok) {
        const { matches } = await listRes.json();
        setMatches(matches);

        // 마지막 게임 종료시간
        if (matches && matches.length > 0) {
          setLastGameEnd(matches[0].gameEndTimestamp);
        }
      }
      setLoading(false);
    })();
  }, [name, tag]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
        {/* 상단 정보 */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold">{name}</span>
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
