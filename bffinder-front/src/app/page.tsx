"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [tag, setTag] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !tag) return;
    router.push(
      `/detail?name=${encodeURIComponent(nickname)}&tag=${encodeURIComponent(
        tag
      )}`
    );
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
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
        <button
          className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600"
          type="submit"
        >
          검색
        </button>
      </form>
    </main>
  );
}
