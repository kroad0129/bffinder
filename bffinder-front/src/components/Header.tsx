"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginNickname, setLoginNickname] = useState("")
  const router = useRouter()

  useEffect(() => {
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

  return (
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
  )
}
