import { $ } from './jquery.js'
import library from './library.js'
import magicDOM from './magic-dom.js'


export class Lazyload {
    constructor(source?: string, { objectFit = 'cover', classList = [] }: {
        objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down'
        classList?: string | string[]
    } = {}) {
        this.component.append(this.image, this.loadCover)


        this.updateSize()
        new ResizeObserver((): void => this.updateSize())
            .observe(this.component)


        $(this.image).css('--object-fit', objectFit)


        if (typeof classList == 'string')
            this.component.classList.add(classList)
        else this.component.classList.add(...classList)


        if (source === undefined) return


        this.source = source
        this.__src = source
    }


    public component: HTMLElement = magicDOM.createElement('div', { classList: 'lazyload' })


    private image: HTMLImageElement = magicDOM.createElement('img', {
        attribute: { alt: '' },
        classList: 'lazyload__image'
    })

    private loadCover: HTMLElement = magicDOM.createElement('div', {
        classList: 'lazyload__cover',
        children: [magicDOM.createElement('div', { classList: 'loading--cover' })]
    })

    private __src?: string


    public set source(src: string) {
        if (src === this.__src) return
        this.__src = src


        let image: HTMLImageElement = this.image
        let loadCover: HTMLElement = this.loadCover


        $(loadCover).dataset('loaded', null)

        async function __l(): Promise<void> {
            let response: Response = await fetch(src, { method: 'GET' })

            if (response.status === 200) {
                const imageBlob: Blob = await response.blob()
                const imageObjectURL: string = URL.createObjectURL(imageBlob)

                image.src = imageObjectURL

                $(loadCover).dataset('loaded', '')
            } else
                $(loadCover).dataset('loaded', null)
        } __l()
    }


    public get source(): string {
        return this.__src ? this.__src : ''
    }


    public updateSize(): void {
        $(this.loadCover).css(
            '--size',
            library.min(this.component.clientWidth, this.component.clientHeight)
        )
    }
}


export default Lazyload
