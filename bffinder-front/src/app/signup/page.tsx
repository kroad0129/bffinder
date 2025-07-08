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
  const [ok, setOk] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);

    try {
      const res = await fetch("http://localhost:8080/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          nickname,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "회원가입 실패!");
        return;
      }

      setOk(true);
      // 회원가입 성공 → 로그인 페이지로 이동 or 안내
      setTimeout(() => router.push("/login"), 1200);
    } catch (e) {
      setError("네트워크 오류!");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-4 w-80"
      >
        <h2 className="text-xl font-bold text-center mb-2">회원가입</h2>
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="email"
          className="border rounded-lg px-4 py-2"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border rounded-lg px-4 py-2"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {ok && (
          <div className="text-green-600 text-sm">
            회원가입 성공! 로그인해주세요.
          </div>
        )}
        <button
          className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600"
          type="submit"
        >
          회원가입
        </button>
        <button
          type="button"
          className="text-gray-500 text-sm underline"
          onClick={() => router.push("/login")}
        >
          로그인
        </button>
      </form>
    </main>
  );
}
