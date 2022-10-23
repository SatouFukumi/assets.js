import create from 'zustand'

export default create<Fukumi.TooltipStore>((set) => ({
    padding: true,
    show: false,
    content: <></>,

    setPadding: (p: boolean) => set({ padding: p }),
    setShow: (s: boolean) => set({ show: s }),
    setContent: (c) => set({ content: c })
}))

declare global {
    namespace Fukumi {
        interface TooltipStore {
            padding: boolean
            show: boolean
            content: React.ReactNode | string | number | boolean

            setPadding: (p: boolean) => void
            setShow: (s: boolean) => void
            setContent: (c: this['content']) => void
        }
    }
}
