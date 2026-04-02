import { useStore } from '../store/useStore'
import type { Role } from '../types'

export function RoleSelector() {
  const role = useStore((s) => s.role)
  const setRole = useStore((s) => s.setRole)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role-select" className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
        Role
      </label>
      <select
        id="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  )
}
