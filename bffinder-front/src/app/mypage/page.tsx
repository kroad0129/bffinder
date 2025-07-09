"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { timeAgo } from "@/components/TimeAgo"

type Boyfriend = {
  id: number
  puuid: string
  alias: string
  savedAt: string
}

type SummonerStatus = {
  isInGame: boolean
  lastGameEnd: number | null
}

function getStatusColor(lastGameEnd: number | null, isInGame: boolean) {
  if (isInGame) {
    return "text-green-700 bg-green-100 border-green-200 animate-pulse"
  }

  if (!lastGameEnd) return ""

  const now = Date.now()
  const diff = now - lastGameEnd
  const hours = Math.floor(diff / (3600 * 1000))

  if (hours < 2) {
    return "text-yellow-700 bg-yellow-100 border-yellow-200"
  } else {
    return ""
  }
}

function getCardBorderColor(lastGameEnd: number | null, isInGame: boolean) {
  if (isInGame) {
    return "border-green-300 bg-green-50/50 hover:bg-green-100/50"
  }

  if (!lastGameEnd) return "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50"

  const now = Date.now()
  const diff = now - lastGameEnd
  const hours = Math.floor(diff / (3600 * 1000))

  if (hours < 2) {
    return "border-yellow-300 bg-yellow-50/50 hover:bg-yellow-100/50"
  } else {
    return "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50"
  }
}

export default function MyPage() {
  const [list, setList] = useState<Boyfriend[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, SummonerStatus>>({})
  const [nameMap, setNameMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    let token
    try {
      token = localStorage.getItem("jwt_token")
    } catch (error) {
      console.error("localStorage access error:", error)
    }

    if (!token) {
      router.replace("/login")
      return
    }

    fetch("http://localhost:8080/api/boyfriends/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("조회 실패")
        const data = await res.json()
        setList(data.slice(0, 5))
      })
      .catch(() => setError("즐겨찾기 목록을 불러올 수 없습니다."))
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (!list.length) return
    list.forEach((bf) => {
      fetch(`http://localhost:8080/api/account/puuid?puuid=${encodeURIComponent(bf.puuid)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.gameName) setNameMap((prev) => ({ ...prev, [bf.puuid]: data.gameName }))
        })

      fetch(`http://localhost:8080/api/match/in-game?puuid=${encodeURIComponent(bf.puuid)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setStatusMap((prev) => ({
            ...prev,
            [bf.puuid]: {
              ...(prev[bf.puuid] || {}),
              isInGame: !!(data && data.inGame),
            },
          }))
        })

      fetch(`http://localhost:8080/api/match/list?puuid=${encodeURIComponent(bf.puuid)}&count=1`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          let lastGameEnd = null
          if (data && Array.isArray(data.matches) && data.matches.length > 0) {
            lastGameEnd = data.matches[0].gameEndTimestamp
          }
          setStatusMap((prev) => ({
            ...prev,
            [bf.puuid]: {
              ...(prev[bf.puuid] || {}),
              lastGameEnd,
            },
          }))
        })
    })
  }, [list])

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말로 즐겨찾기에서 제거하시겠습니까?")) return
    setDeletingId(id)

    let token
    try {
      token = localStorage.getItem("jwt_token")
    } catch (error) {
      console.error("localStorage access error:", error)
      alert("로그인이 필요합니다.")
      setDeletingId(null)
      return
    }

    const res = await fetch(`http://localhost:8080/api/boyfriends/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setList((prev) => prev.filter((bf) => bf.id !== id))
    } else {
      alert("제거에 실패했습니다. 다시 시도해주세요.")
    }
    setDeletingId(null)
  }

  return (
    <main className="min-h-screen flex flex-col items-center pt-20 bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* 왼쪽 상단 로고 */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-gray-700">BFF</div>

      {/* 왼쪽 상단 뒤로가기 버튼 - 디테일 페이지와 동일한 스타일 */}
      <button
        className="absolute top-6 left-32 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
        onClick={() => router.push("/")}
      >
        ← 다른 소환사 찾기
      </button>

      {/* 메인 컨텐츠 - 중앙 정렬 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">마이페이지</h1>
        <p className="text-gray-600 text-lg">{"관심 있는 소환사들의 상태를 확인해보세요"}</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl soft-shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">⭐ 즐겨찾기 목록</h2>

        {loading ? (
          <div className="text-blue-600 font-medium flex items-center gap-2 justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            확인 중...
          </div>
        ) : error ? (
          <div className="text-red-600 font-medium text-center py-8 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        ) : list.length === 0 ? (
          <div className="text-gray-500 text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-lg mb-2">🤷‍♀️ 아직 즐겨찾기한 소환사가 없네요!</p>
            <p className="text-sm">{"관심 있는 소환사를 검색해서 즐겨찾기에 추가해보세요 😊"}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {list.map((bf) => {
              const status = statusMap[bf.puuid]
              const gameName = nameMap[bf.puuid]
              const isCurrentlyGaming = status?.isInGame
              const statusColorClass = getStatusColor(status?.lastGameEnd || null, isCurrentlyGaming || false)
              return (
                <li
                  key={bf.id}
                  className={`relative border rounded-xl p-5 flex items-center transition-all duration-200 cursor-pointer soft-shadow ${getCardBorderColor(
                    status?.lastGameEnd || null,
                    isCurrentlyGaming || false,
                  )}`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button") !== null) {
                      return
                    }
                    router.push(`/detail?puuid=${encodeURIComponent(bf.puuid)}`)
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-lg text-gray-800 truncate max-w-[200px]">
                        {gameName || "🔍 확인 중..."}
                      </span>
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        {bf.alias}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      {status ? (
                        status.isInGame ? (
                          <span className={`px-3 py-1 rounded-lg font-semibold border ${statusColorClass}`}>
                            🎮 현재 게임 중
                          </span>
                        ) : status.lastGameEnd ? (
                          <span
                            className={`px-3 py-1 rounded-lg border ${
                              statusColorClass || "text-gray-600 bg-gray-100 border-gray-200"
                            }`}
                          >
                            😴 마지막 접속: {timeAgo(status.lastGameEnd)}
                          </span>
                        ) : (
                          <span className="text-gray-500">🤷‍♀️ 최근 접속 정보 없음</span>
                        )
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                          확인 중...
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">📅 추가일: {new Date(bf.savedAt).toLocaleString()}</div>
                  </div>

                  <button
                    className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium border
                      border-red-300 text-red-600 bg-red-50 hover:bg-red-100
                      hover:border-red-400 transition-all duration-200 
                      ${deletingId === bf.id ? "opacity-40 pointer-events-none" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(bf.id)
                    }}
                  >
                    {deletingId === bf.id ? "제거중..." : "제거"}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center bg-gray-50 border border-gray-200 rounded-xl p-4">
          ⭐ 최대 <span className="font-semibold text-blue-600">5명</span>까지 저장할 수 있습니다
          <br />
          <span className="text-green-600">🟢 게임 중</span> | <span className="text-yellow-600">🟡 2시간 이내</span> |{" "}
          <span className="text-gray-600">⚪ 그 이상</span>
        </div>
      </div>
    </main>
  )
}
