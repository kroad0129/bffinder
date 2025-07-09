"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // 이벤트 객체 e는 여기서만 사용됩니다.
    setError("");
    setLoading(true);

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          nickname,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "회원가입에 실패했습니다!");
        setLoading(false);
        return;
      }

      // 성공! => 이메일 인증 안내 페이지로 이동
      router.push(`/signup/verify?email=${encodeURIComponent(email)}`);
    } catch {
      setError("네트워크 오류가 발생했습니다!");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* 왼쪽 상단 로고 */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-gray-700">
        BFF
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        className="absolute top-6 left-32 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
        onClick={() => router.push("/")}
      >
        ← 메인으로
      </button>

      {/* 메인 컨텐츠 - 완전 중앙 정렬 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">회원가입</h1>
        <p className="text-gray-600">
          {"소환사들의 게임 상태를 쉽게 확인해보세요! 🎮"}
        </p>
      </div>

      <form
        onSubmit={handleSignup}
        className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl soft-shadow-lg flex flex-col gap-5 w-96"
      >
        <div className="space-y-4">
          <input
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            type="email"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="text-xs text-blue-500 font-semibold text-center pl-1 pb-1">
            회원가입 시 이메일로 인증 안내메일이 발송됩니다.
          </div>
          <input
            type="password"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-xl py-3 px-4">
            {error}
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-semibold text-lg transition-all duration-200 soft-shadow"
          type="submit"
          disabled={loading}
        >
          {loading ? "회원가입 중..." : "회원가입"}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-gray-500 text-sm hover:text-gray-700 underline transition-colors duration-200"
            onClick={() => router.push("/login")}
          >
            이미 계정이 있으신가요? 로그인 →
          </button>
        </div>
      </form>
    </main>
  );
}
