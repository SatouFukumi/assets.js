var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $ } from './jquery.js';
import library from './library.js';
import magicDOM from './magic-dom.js';
export class Lazyload {
    constructor(source, { objectFit = 'cover', classList = [] } = {}) {
        this.component = magicDOM.createElement('div', { classList: 'lazyload' });
        this.image = magicDOM.createElement('img', {
            attribute: { alt: '' },
            classList: 'lazyload__image'
        });
        this.loadCover = magicDOM.createElement('div', {
            classList: 'lazyload__cover',
            children: [magicDOM.createElement('div', { classList: 'loading--cover' })]
        });
        this.component.append(this.image, this.loadCover);
        this.updateSize();
        new ResizeObserver(() => this.updateSize())
            .observe(this.component);
        $(this.image).css('--object-fit', objectFit);
        if (typeof classList == 'string')
            this.component.classList.add(classList);
        else
            this.component.classList.add(...classList);
        if (source === undefined)
            return;
        this.source = source;
        this.__src = source;
    }
    set source(src) {
        if (src === this.__src)
            return;
        this.__src = src;
        let image = this.image;
        let loadCover = this.loadCover;
        $(loadCover).dataset('loaded', null);
        function __l() {
            return __awaiter(this, void 0, void 0, function* () {
                let response = yield fetch(src, { method: 'GET' });
                if (response.status === 200) {
                    const imageBlob = yield response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    image.src = imageObjectURL;
                    $(loadCover).dataset('loaded', '');
                }
                else
                    $(loadCover).dataset('loaded', null);
            });
        }
        __l();
    }
    get source() {
        return this.__src ? this.__src : '';
    }
    updateSize() {
        $(this.loadCover).css('--size', library.min(this.component.clientWidth, this.component.clientHeight));
    }
}
export default Lazyload;
