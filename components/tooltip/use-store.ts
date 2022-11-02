import create from "zustand"

const useStore = create<Fukumi.TooltipStore>((set) => ({
    padding: true,
    show: false,
    content: "",

    setPadding: (p: boolean) => set({ padding: p }),
    setShow: (s: boolean) => set({ show: s }),
    setContent: (c) => set({ content: c }),
}))

export default useStore

declare global {
    namespace Fukumi {
        interface TooltipStore {
            padding: boolean
            show: boolean
            content: React.ReactNode

            setPadding: (p: boolean) => void
            setShow: (s: boolean) => void
            setContent: (c: React.ReactNode) => void
        }
    }
}
