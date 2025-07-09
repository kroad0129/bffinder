"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [nickname, setNickname] = useState("")
  const [tag, setTag] = useState("")
  const [loginNickname, setLoginNickname] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const token = localStorage.getItem("jwt_token")
      const nick = localStorage.getItem("login_nickname")
      setIsLoggedIn(!!token)
      setLoginNickname(nick || "")
    } catch (error) {
      console.error("localStorage access error:", error)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("login_nickname")
      setIsLoggedIn(false)
      setLoginNickname("")
      window.location.reload()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!nickname || !tag) return
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:8080/api/account/nametag?gameName=${encodeURIComponent(
          nickname,
        )}&tagLine=${encodeURIComponent(tag)}`,
      )
      if (!res.ok) {
        setError("소환사를 찾을 수 없습니다.")
        setLoading(false)
        return
      }
      const { puuid } = await res.json()
      router.push(`/detail?puuid=${encodeURIComponent(puuid)}`)
    } catch {
      setError("네트워크 오류가 발생했습니다!")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* 왼쪽 상단 로고 */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-gray-700">BFF</div>

      {/* 상단 네비게이션 */}
      <div className="flex gap-3 absolute top-6 right-6 z-50">
        {!isLoggedIn ? (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
              onClick={() => router.push("/login")}
            >
              로그인
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
              onClick={() => router.push("/signup")}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
              onClick={() => router.push("/mypage")}
            >
              {loginNickname}님 마이페이지
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow ml-2"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>

      {/* 메인 컨텐츠 - 완전 중앙 정렬 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">잠든다더니 게임중? 🎮</h1>
        <div className="space-y-2 text-gray-600">
          <p className="text-xl">피곤하다며 먼저 잔다던 그 사람의 진실을 확인해보세요</p>
          <p className="text-lg text-gray-500">{"남자친구가 안자고 게임 하는거 같다구요? 'BF2'로 검색해보세요! 😏"}</p>
        </div>
      </div>

      {/* 검색 폼 - 완전 중앙 정렬 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl soft-shadow-lg flex flex-col gap-5 w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800">소환사 검색</h2>

        <div className="space-y-4">
          <input
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="소환사 닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="태그 (예: KR1, NA1)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-xl py-2 px-4">
            {error}
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-semibold text-lg transition-all duration-200 soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              진실 확인 중...
            </span>
          ) : (
            "진실 확인하기 🔍"
          )}
        </button>
      </form>

      {/* 하단 설명 - 완전 중앙 정렬 */}
      <div className="absolute bottom-8 text-center text-gray-500 text-sm max-w-md">
        <p className="mb-2">
          💡 <strong>꿀팁:</strong> 즐겨찾기에 추가하면 실시간으로 게임 상태를 확인할 수 있어요!
        </p>
        <p>{"잠든다고 했는데 '게임 중'이라고 뜨면... 어떻게 하실 건가요? 😅"}</p>
      </div>
    </main>
  )
}
