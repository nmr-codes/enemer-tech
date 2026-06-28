import { prisma } from "@/lib/prisma"
import { ShieldCheck, User as UserIcon, Mail } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users & Auth Control</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your registered users and authentication connections.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
          <UserIcon className="h-4 w-4" />
          <span className="text-sm font-semibold">{users.length} Total Users</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-white/[0.02] border-b border-neutral-200 dark:border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">User</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Role</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Connections</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.06]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-white">{user.name || "Unknown"}</div>
                        <div className="text-xs text-neutral-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      user.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                    }`}>
                      {user.role === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {user.accounts.length > 0 ? user.accounts.map(acc => (
                        <span key={acc.provider} className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs border border-blue-100 dark:border-blue-500/20 capitalize">
                          {acc.provider}
                        </span>
                      )) : (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs border border-neutral-200 dark:border-neutral-700">
                          Credentials
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-500">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
