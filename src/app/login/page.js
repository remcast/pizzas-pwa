"use client";

import { useActionState } from "react";
import { login } from "../actions/authActions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow-md dark:bg-blue-900"
      >
        <h2 className="text-2xl font-bold">Iniciar sesión</h2>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Correo electrónico
          <input
            type="email"
            name="email"
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-blue-700 dark:bg-blue-800"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Contraseña
          <input
            type="password"
            name="password"
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-blue-700 dark:bg-blue-800"
          />
        </label>

        {state?.error && (
          <p className="text-sm text-amber-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
