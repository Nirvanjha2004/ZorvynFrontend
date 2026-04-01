import { useStore } from '../store/useStore'
import type { Role } from '../types'

export function RoleSelector() {
  const role = useStore((s) => s.role)
  const setRole = useStore((s) => s.setRole)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role-select" className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        Role
      </label>
      <select
        id="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  )
}
