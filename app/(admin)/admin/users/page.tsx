import { prisma } from "@/lib/prisma"
import { ShieldCheck, User as UserIcon, Mail, Activity, LogOut, Clock, CalendarDays, MoreHorizontal } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      sessions: {
        orderBy: { expires: "desc" },
        take: 1
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Analytics Calculations
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === "ADMIN").length
  const standardUsers = users.filter(u => u.role === "USER").length
  
  const now = new Date()
  const activeSessions = users.filter(u => u.sessions.some(s => new Date(s.expires) > now)).length
  const newUsersThisWeek = users.filter(u => {
    const diffTime = Math.abs(now.getTime() - u.createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">User Control Panel</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Monitor activity, manage roles, and track authentication analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-[0_4px_14px_rgba(0,95,232,0.3)]">
            Invite User
          </button>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserIcon className="w-16 h-16 text-brand" />
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Users</p>
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">{totalUsers}</p>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              +{newUsersThisWeek}
            </span>
            <span className="text-neutral-400 ml-2">new this week</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Sessions</p>
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">{activeSessions}</p>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-neutral-400">Users currently logged in</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-16 h-16 text-purple-500" />
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Administrators</p>
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">{adminUsers}</p>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-neutral-400">Full system access</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserIcon className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Standard Users</p>
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">{standardUsers}</p>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-neutral-400">Restricted public access</span>
          </div>
        </div>
      </div>

      {/* Advanced Users Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-neutral-200 dark:border-white/[0.06] flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 dark:text-white">Registered Directory</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-white/[0.02] border-b border-neutral-200 dark:border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">User</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Role</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Auth Method</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Last Active</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.06]">
              {users.map((user) => {
                const hasActiveSession = user.sessions.some(s => new Date(s.expires) > now)
                
                return (
                  <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white dark:ring-neutral-900">
                            {user.image ? (
                              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {(user.name || user.email).charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${hasActiveSession ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}></span>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            {user.name || "Unknown"}
                            {new Date(user.createdAt) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand/10 text-brand uppercase tracking-wider">New</span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        user.role === "ADMIN" 
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                      }`}>
                        {user.role === "ADMIN" ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.accounts.length > 0 ? user.accounts.map(acc => (
                          <span key={acc.provider} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-500/20 capitalize shadow-sm">
                            {acc.provider}
                          </span>
                        )) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-100 dark:border-emerald-500/20 shadow-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            Magic Link
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          {user.sessions[0] ? new Date(user.sessions[0].expires.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : "Never"}
                        </div>
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-neutral-400" />
                          Joined {user.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-brand hover:bg-brand/10 transition-colors" title="Manage Role">
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Revoke Sessions">
                          <LogOut className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" title="More Options">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <UserIcon className="w-12 h-12 mb-3 opacity-20" />
                      <p>No users found in the system.</p>
                    </div>
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
