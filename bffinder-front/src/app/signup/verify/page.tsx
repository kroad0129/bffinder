"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EmailVerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || ""; // 쿼리에서 email 파라미터 추출

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  // 인증 메일 재전송 요청 함수
  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg(null);

    try {
      const res = await fetch(
        "http://localhost:8080/api/user/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        setResendMsg(data.message || "재전송에 실패했습니다.");
      } else {
        setResendMsg(
          "인증 메일이 다시 전송되었습니다! 메일함을 확인해 주세요."
        );
      }
    } catch (e) {
      setResendMsg("네트워크 오류가 발생했습니다.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-96 shadow text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          이메일 인증이 필요합니다
        </h1>
        <p className="mb-5 text-gray-600">
          <b>{email}</b> 주소로 인증 메일이 발송되었습니다.
          <br />
          메일함에서 인증 버튼을 클릭해주세요.
          <br />
          <span className="text-xs text-gray-400">
            (스팸/프로모션함도 꼭 확인!)
          </span>
        </p>
        <button
          className={`w-full py-3 rounded-xl font-semibold mt-3 ${
            resendLoading
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } transition-all`}
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "전송 중..." : "인증 메일 다시 보내기"}
        </button>
        {resendMsg && (
          <div
            className={`mt-4 text-sm rounded-xl py-2 px-3 ${
              resendMsg.startsWith("인증")
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {resendMsg}
          </div>
        )}
        <div className="mt-8 text-xs text-gray-500">
          인증이 완료되면 <b>로그인</b>을 진행해 주세요.
          <br />
          <button
            className="underline hover:text-blue-700 ml-1"
            onClick={() => router.push("/login")}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </main>
  );
}
