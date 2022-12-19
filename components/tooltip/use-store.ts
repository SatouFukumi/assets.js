import create from "zustand"

type TooltipStore = {
  show: boolean
  content: React.ReactNode
  size: { width: number; height: number }
  display: { activated: boolean; deactivated: boolean }
  padding: boolean

  setShow(show: boolean): void
  setContent(content: React.ReactNode): void
  setSize(size: { width: number; height: number }): void
  setPadding(padding?: boolean): void
  setDisplay(display: { activated: boolean; deactivated: boolean }): void
}

const useStore = create<TooltipStore>((set) => ({
  show: false,
  content: null,
  size: { width: 0, height: 0 },
  display: { activated: false, deactivated: true },
  padding: true,

  setShow: (show) => set({ show }),
  setContent: (content) => set({ content }),
  setSize: (size) => set({ size }),
  setDisplay: (display) => set({ display }),
  setPadding: (padding = true) => set({ padding }),
}))

export default useStore
