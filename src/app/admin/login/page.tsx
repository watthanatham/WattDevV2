"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 dark:bg-black">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h1 className="text-xl font-bold">เข้าสู่ระบบ Admin</h1>
        <p className="mt-1 text-sm text-zinc-500">
          สำหรับจัดการบล็อกและข้อมูล Portfolio
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">อีเมล</label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        {state?.error && (
          <p className="mt-4 text-sm text-red-500">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
        >
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
