import create from 'zustand'
import COLOR from './color'

const useStore = create<Fukumi.GlasiumStore>((set) => ({
    shape: 'triangle',
    rotate: false,
    speed: 6,
    count: 10,
    colorOptions: COLOR.blue,
    scale: 2,

    set: (props: Fukumi.GlasiumProps) => { 
        set(props)
    }
}))

export default useStore

declare global {
    namespace Fukumi {
        interface GlasiumStore extends Required<GlasiumProps> {
            set: (props: GlasiumProps) => void
        }
    }
}
