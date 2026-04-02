import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Toast } from '../types'

interface ToastWithUndo extends Toast {
  undoLabel?: string
  onUndo?: () => void
  timeoutId?: ReturnType<typeof setTimeout>
}

interface ToastStore {
  toasts: ToastWithUndo[]
  addToast: (message: string, type?: Toast['type'], undo?: { label: string; onUndo: () => void }) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message, type = 'success', undo) => {
    const id = uuidv4()
    const timeoutId = setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, undo ? 5000 : 3500)

    set((state) => ({
      toasts: [
        ...state.toasts,
        { id, message, type, undoLabel: undo?.label, onUndo: undo?.onUndo, timeoutId },
      ],
    }))
  },

  removeToast: (id) => {
    const toast = get().toasts.find((t) => t.id === id)
    if (toast?.timeoutId) clearTimeout(toast.timeoutId)
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))

export function useToast() {
  return useToastStore((s) => s.addToast)
}
