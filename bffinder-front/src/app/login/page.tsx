"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        let msg = "로그인 실패! 아이디 또는 비밀번호를 확인하세요.";
        try {
          const errData = await res.json();
          if (errData.message) msg = errData.message;
        } catch {}

        if (msg.includes("이메일 인증이 필요")) {
          router.push(
            `/signup/verify-pending?username=${encodeURIComponent(username)}`
          );
          return;
        } else {
          setError(msg);
        }
        return;
      }

      const data = await res.json();
      localStorage.setItem("jwt_token", data.token);

      const infoRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (infoRes.ok) {
        const info = await infoRes.json();
        localStorage.setItem("login_nickname", info.nickname);
      }

      router.push("/");
    } catch {
      setError("네트워크 오류가 발생했습니다!");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <div className="absolute top-6 left-6 text-lg font-semibold text-gray-700">
        BFF
      </div>

      <button
        className="absolute top-6 left-32 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 px-5 font-medium transition-all duration-200 soft-shadow"
        onClick={() => router.push("/")}
      >
        ← 메인으로
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">로그인</h1>
        <p className="text-gray-600">관심 있는 소환사들을 확인해보세요 😊</p>
      </div>

      <form
        onSubmit={handleLogin}
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
        >
          로그인
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-gray-500 text-sm hover:text-gray-700 underline transition-colors duration-200"
            onClick={() => router.push("/signup")}
          >
            계정이 없으신가요? 회원가입 →
          </button>
        </div>
      </form>
    </main>
  );
}
