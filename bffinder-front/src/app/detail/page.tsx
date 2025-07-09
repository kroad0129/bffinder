"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MatchList from "@/components/MatchList";
import { timeAgo } from "@/components/TimeAgo";
import Header from "@/components/Header";

type Match = {
  matchId: string;
  gameCreation: number;
  gameEndTimestamp: number;
  gameDuration: number;
  win: boolean;
};

function getSleepMessage(ts: number | string | null | undefined): string {
  if (!ts) return "";

  const now = Date.now();
  const t = typeof ts === "string" ? Number(ts) : ts;
  const diff = now - t;
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(diff / (3600 * 1000));

  if (min < 10) {
    return "진짜 자고 있는 것 같아요!";
  } else if (hour < 1) {
    return "의심스러워요, 지금 게임했는데?";
  } else if (hour < 2) {
    return "아직 좀 더 지켜봐요!";
  } else {
    return "진짜 자고 있는 거 같아요!";
  }
}

function getStatusColor(lastGameEnd: number | null, isInGame: boolean) {
  if (isInGame) {
    return "text-green-700 bg-green-100 border-green-200 animate-pulse";
  }

  if (!lastGameEnd) return "";

  const now = Date.now();
  const diff = now - lastGameEnd;
  const hours = Math.floor(diff / (3600 * 1000));

  if (hours < 2) {
    return "text-yellow-700 bg-yellow-100 border-yellow-200";
  } else {
    return "";
  }
}

export default function DetailPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // puuid가 배열일 수도 있으니 안전하게 처리
  const puuid = Array.isArray(searchParams.puuid) ? searchParams.puuid[0] : searchParams.puuid || "";

  const router = useRouter();

  const [nickname, setNickname] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [lastGameEnd, setLastGameEnd] = useState<number | null>(null);
  const [isInGame, setIsInGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!puuid) return;
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:8080/api/account/puuid?puuid=${puuid}`
        );
        if (res.ok) {
          const data = await res.json();
          setNickname(data.gameName);
        }
      } catch (e) {
        setError("소환사 정보를 불러오는 데 실패했습니다.");
      }

      try {
        const igRes = await fetch(
          `http://localhost:8080/api/match/in-game?puuid=${puuid}`
        );
        if (igRes.ok) {
          const data = await igRes.json();
          setIsInGame(data.inGame);
        }
      } catch {
        // 무시 혹은 필요 시 에러 처리
      }

      try {
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
      } catch {
        // 무시 혹은 필요 시 에러 처리
      }
      setLoading(false);
    })();
  }, [puuid]);

  const handleSave = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    const alias = window.prompt(
      "이 소환사에게 어떤 별명을 지어주시겠어요? (예: 우리 남친, 의심스러운 그 사람)"
    );
    if (!alias) return;

    setSaveMsg(null);
    const res = await fetch("http://localhost:8080/api/boyfriends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        puuid,
        alias,
      }),
    });

    if (res.ok) {
      setSaveMsg("🎯 즐겨찾기에 성공적으로 추가되었습니다!");
    } else {
      setSaveMsg("⚠️ 저장에 실패했습니다. (이미 저장했거나 오류 발생)");
    }
  };

  const statusColorClass = getStatusColor(lastGameEnd, isInGame);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-50 to-slate-100 py-10 relative">
      {/* 왼쪽 상단 로고 */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-gray-700">
        BFF
      </div>

      {/* 왼쪽 상단 뒤로가기 버튼 - 더 눈에 띄게 */}
      <button
        className="absolute top-6 left-32 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
        onClick={() => router.push("/")}
      >
        ← 다른 사람 확인하기
      </button>

      <Header />

      {/* 메인 컨텐츠 - 중앙 정렬 */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl soft-shadow-lg mt-8">
        {/* 상단 정보와 즐겨찾기 버튼 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {nickname || "🔍 확인 중..."}
            </h1>

            {/* 상태 정보를 닉네임 아래로 이동 */}
            {loading ? (
              <span className="text-gray-500 text-sm flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                확인 중...
              </span>
            ) : error ? (
              <span className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded-lg">
                {error}
              </span>
            ) : isInGame ? (
              <div>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-bold border ${statusColorClass}`}
                >
                  🎮 현재 게임 중!
                </span>
                <p className="text-xs text-blue-500 font-semibold mt-1">
                  {"잠든다더니... 🤔"}
                </p>
              </div>
            ) : lastGameEnd ? (
              <div>
                <span
                  className={`px-3 py-1 rounded-xl text-sm border ${
                    statusColorClass ||
                    "text-gray-600 bg-gray-100 border-gray-200"
                  }`}
                >
                  😴 마지막 플레이: {timeAgo(lastGameEnd)}
                </span>
                <p className="text-xs text-blue-500 font-semibold mt-1">
                  {getSleepMessage(lastGameEnd)}
                </p>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">📊 정보 없음</span>
            )}
          </div>

          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 soft-shadow ml-4"
            onClick={handleSave}
          >
            ⭐ 즐겨찾기에 추가
          </button>
        </div>

        {saveMsg && (
          <div
            className={`mb-6 text-center text-sm font-medium p-3 rounded-xl ${
              saveMsg.includes("성공")
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                : "text-red-700 bg-red-50 border border-red-200"
            }`}
          >
            {saveMsg}
          </div>
        )}

        {/* 매치 리스트 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📊 최근 게임 기록
          </h2>
          {loading ? (
            <div className="text-gray-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              게임 기록 불러오는 중...
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              {error}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-gray-500 text-sm mt-4 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              🤷‍♀️ 최근 게임 기록이 없네요... 정말 자고 있었나봐요?
            </div>
          ) : (
            <MatchList matches={matches} />
          )}
        </div>
      </div>
    </main>
  );
}
