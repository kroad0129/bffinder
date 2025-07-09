"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function VerifyPendingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const username = params.get("username") || ""

  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) {
      setError("잘못된 접근입니다.")
      setLoading(false)
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/email?username=${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error("계정 정보 조회 실패")
        return res.json()
      })
      .then((data) => {
        setEmail(data.email)
        setLoading(false)
      })
      .catch(() => {
        setError("이메일 정보를 불러올 수 없습니다.")
        setLoading(false)
      })
  }, [username])

  const handleResend = async () => {
    setError("")
    setSent(false)
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resend-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      if (res.ok) setSent(true)
      else setError("재발송 실패! 잠시 후 다시 시도해 주세요.")
    } catch {
      setError("네트워크 오류!")
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">이메일 인증 대기</h1>
        {loading ? (
          <p className="text-gray-400">로딩 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              <b>{email}</b> 주소로 인증메일이 전송되었습니다.
              <br />
              메일함을 확인하고 인증을 완료해주세요.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 px-6 font-semibold mt-2"
              onClick={handleResend}
              disabled={sent}
            >
              인증메일 다시 받기
            </button>
            {sent && <p className="mt-4 text-emerald-600 font-bold">인증메일을 재발송했습니다!</p>}
          </>
        )}
        <div>
          <button className="mt-6 text-gray-400 underline" onClick={() => router.push("/login")}>
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </main>
  )
}

export default function VerifyPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <VerifyPendingContent />
    </Suspense>
  )
}
