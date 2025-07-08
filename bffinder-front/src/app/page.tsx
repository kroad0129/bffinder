"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [tag, setTag] = useState("");
  const [loginNickname, setLoginNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 로그인 상태 및 닉네임 감지
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("jwt_token");
    const nick = localStorage.getItem("login_nickname");
    setIsLoggedIn(!!token);
    setLoginNickname(nick || "");
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("login_nickname");
    setIsLoggedIn(false);
    setLoginNickname("");
    router.refresh();
  };

  // 🔥 소환사 검색 → puuid 조회 → 이동
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nickname || !tag) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/account/nametag?gameName=${encodeURIComponent(
          nickname
        )}&tagLine=${encodeURIComponent(tag)}`
      );
      if (!res.ok) {
        setError("소환사를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }
      const { puuid } = await res.json();
      router.push(`/detail?puuid=${encodeURIComponent(puuid)}`);
    } catch {
      setError("네트워크 오류!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* 상단 우측 로그인/회원가입/마이페이지/로그아웃 */}
      <div className="flex gap-2 absolute top-4 right-4">
        {!isLoggedIn ? (
          <>
            <button
              className="bg-blue-500 text-white rounded-lg py-2 px-4 font-semibold hover:bg-blue-600"
              onClick={() => router.push("/login")}
            >
              로그인
            </button>
            <button
              className="bg-gray-400 text-white rounded-lg py-2 px-4 font-semibold hover:bg-gray-600"
              onClick={() => router.push("/signup")}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-green-500 text-white rounded-lg py-2 px-4 font-semibold hover:bg-green-600"
              onClick={() => router.push("/mypage")}
            >
              {loginNickname || "error"}님 마이페이지
            </button>
            <button
              className="bg-red-500 text-white rounded-lg py-2 px-4 font-semibold hover:bg-red-600 ml-2"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>

      {/* 소환사 검색 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-2">소환사 검색</h1>
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="태그 (#KR1 등)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </form>
    </main>
  );
}
