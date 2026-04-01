import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AccountDashboardClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user
    ? { id: session.user.id, name: session.user.name, email: session.user.email }
    : null;

  return <AccountDashboardClient user={user} />;
}
