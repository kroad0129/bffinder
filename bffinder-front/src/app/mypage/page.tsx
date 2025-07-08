"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 타입 선언
type Boyfriend = {
  id: number;
  puuid: string;
  alias: string;
  savedAt: string;
};

type SummonerStatus = {
  isInGame: boolean;
  lastGameEnd: number | null;
};

function timeAgo(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 60 * 1000) return "방금 전";
  if (diff < 3600 * 1000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400 * 1000) return `${Math.floor(diff / 3600000)}시간 전`;
  return `${Math.floor(diff / 86400000)}일 전`;
}

export default function MyPage() {
  const [list, setList] = useState<Boyfriend[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, SummonerStatus>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:8080/api/boyfriends/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("조회 실패");
        const data = await res.json();
        setList(data.slice(0, 5));
      })
      .catch(() => setError("내 소환사 목록을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [router]);

  // 각 소환사의 상태(게임중/마지막접속) 조회 - DetailPage 방식으로!
  useEffect(() => {
    if (!list.length) return;
    list.forEach((bf) => {
      // 1) in-game 여부
      fetch(
        `http://localhost:8080/api/match/in-game?puuid=${encodeURIComponent(
          bf.puuid
        )}`
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setStatusMap((prev) => ({
            ...prev,
            [bf.puuid]: {
              ...(prev[bf.puuid] || {}),
              isInGame: !!(data && data.inGame),
            },
          }));
        });

      // 2) 최근 매치 리스트에서 마지막 게임 종료시간
      fetch(
        `http://localhost:8080/api/match/list?puuid=${encodeURIComponent(
          bf.puuid
        )}&count=1`
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          let lastGameEnd = null;
          if (data && Array.isArray(data.matches) && data.matches.length > 0) {
            lastGameEnd = data.matches[0].gameEndTimestamp;
          }
          setStatusMap((prev) => ({
            ...prev,
            [bf.puuid]: {
              ...(prev[bf.puuid] || {}),
              lastGameEnd,
            },
          }));
        });
    });
  }, [list]);

  return (
    <main className="min-h-screen flex flex-col items-center pt-20 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8">마이페이지</h1>
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">내가 저장한 소환사 목록</h2>
        {loading ? (
          <div className="text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : list.length === 0 ? (
          <div className="text-gray-400">저장한 소환사가 없습니다.</div>
        ) : (
          <ul className="space-y-4">
            {list.map((bf) => {
              const status = statusMap[bf.puuid];
              return (
                <li
                  key={bf.id}
                  className="border rounded-lg p-4 flex justify-between items-center bg-gray-100 cursor-pointer hover:bg-blue-100"
                  onClick={() =>
                    router.push(`/detail?puuid=${encodeURIComponent(bf.puuid)}`)
                  }
                >
                  <div>
                    <div className="font-bold text-lg">{bf.alias}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {status ? (
                        status.isInGame ? (
                          <span className="text-green-700 bg-green-100 px-2 py-1 rounded font-semibold">
                            게임중
                          </span>
                        ) : status.lastGameEnd ? (
                          <span>
                            마지막 접속: {timeAgo(status.lastGameEnd)}
                          </span>
                        ) : (
                          <span>최근 접속 정보 없음</span>
                        )
                      ) : (
                        <span>조회중...</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-300">
                      저장일: {new Date(bf.savedAt).toLocaleString()}
                    </div>
                  </div>
                  {/* 삭제 버튼 (생략 가능) */}
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-4 text-xs text-gray-500">
          최대 5개까지 저장할 수 있습니다.
        </div>
      </div>
      <button
        className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700"
        onClick={() => router.push("/")}
      >
        메인으로
      </button>
    </main>
  );
}
