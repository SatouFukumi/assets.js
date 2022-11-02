import create from "zustand"

const useStore = create<Fukumi.TooltipStore>((set) => ({
    show: false,
    content: null,

    setShow: (s: boolean) => set({ show: s }),
    setContent: (c) => set({ content: c }),
}))

export default useStore

declare global {
    namespace Fukumi {
        interface TooltipStore {
            show: boolean
            content: React.ReactNode

            setShow: (s: boolean) => void
            setContent: (c: React.ReactNode) => void
        }
    }
}
