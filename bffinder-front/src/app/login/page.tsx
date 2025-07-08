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
      // 1. 로그인 요청 (JWT 토큰 획득)
      const res = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("jwt_token", data.token);

      // 2. 토큰으로 내 정보 요청 → 닉네임 저장
      const infoRes = await fetch("http://localhost:8080/api/user/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (infoRes.ok) {
        const info = await infoRes.json();
        localStorage.setItem("login_nickname", info.nickname); // 받아오는 값이 nickname이면
      }

      router.push("/");
      router.refresh();
    } catch (e) {
      setError("네트워크 오류!");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-4 w-80"
      >
        <h2 className="text-xl font-bold text-center mb-2">로그인</h2>
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border rounded-lg px-4 py-2"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600"
          type="submit"
        >
          로그인
        </button>
        <button
          type="button"
          className="text-gray-500 text-sm underline"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </button>
      </form>
    </main>
  );
}
