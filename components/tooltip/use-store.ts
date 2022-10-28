import create from 'zustand'

const useStore = create<Fukumi.TooltipStore>((set) => ({
    padding: true,
    show: false,
    content: '',
    activated: false,
    deactivated: true,

    setPadding: (p: boolean) => set({ padding: p }),
    setShow: (s: boolean) => set({ show: s }),
    setContent: (c) => set({ content: c }),
    setActivated: (a) => set({ activated: a }),
    setDeactivated: (d) => set({ deactivated: d })
}))

export default useStore

declare global {
    namespace Fukumi {
        interface TooltipStore {
            padding: boolean
            show: boolean
            content: React.ReactNode | string | number | boolean
            activated: boolean
            deactivated: boolean

            setPadding: (p: boolean) => void
            setShow: (s: boolean) => void
            setContent: (c: this['content']) => void
            setActivated: (a: boolean) => void
            setDeactivated: (d: boolean) => void
        }
    }
}
