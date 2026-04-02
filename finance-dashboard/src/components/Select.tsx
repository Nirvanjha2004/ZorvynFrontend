import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface SelectOption {
  value: string
  label: string
  icon?: string
  description?: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  className?: string
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function Select({ value, onChange, options, placeholder, label, className = '' }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  const openPanel = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const panelHeight = Math.min(options.length * 40 + 8, 280)
    const top = spaceBelow >= panelHeight ? rect.bottom + 4 : rect.top - panelHeight - 4
    setCoords({ top: top + window.scrollY, left: rect.left + window.scrollX, width: Math.max(rect.width, 180) })
    setOpen(true)
  }, [options.length])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open])

  return (
    <div className={`relative ${className}`}>
      {label && (
        <span className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 w-full text-sm border rounded-xl px-3 py-2 transition-colors text-left
          ${open
            ? 'border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
      >
        {selected?.icon && <span className="text-base leading-none">{selected.icon}</span>}
        <span className="flex-1 truncate font-medium">
          {selected ? selected.label : <span className="text-gray-400 dark:text-gray-500">{placeholder ?? 'Select…'}</span>}
        </span>
        <span className={`flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </span>
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          role="listbox"
          style={{ top: coords.top, left: coords.left, width: coords.width, minWidth: 160 }}
          className="fixed z-[200] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden animate-dropdown-in"
        >
          <div className="py-1 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left
                    ${isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {opt.icon && <span className="text-base leading-none w-5 text-center flex-shrink-0">{opt.icon}</span>}
                  <span className="flex-1 truncate font-medium">{opt.label}</span>
                  {isSelected && (
                    <span className="flex-shrink-0 text-indigo-500 dark:text-indigo-400">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
