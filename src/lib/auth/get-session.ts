import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/auth/sign-in");
  return session;
}
