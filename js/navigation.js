import Lazyload from './lazyload.js';
import Glasium, { COLOR } from './glasium.js';
import { $, $$ } from './jquery.js';
import library from './library.js';
import magicDOM from './magic-dom.js';
export const navigation = {
    get initialized() { return !!this.component; },
    block: {},
    setUnderlay(activate = false) {
        if (this.underlay === undefined)
            return;
        $(this.underlay).dataset('activated', activate ? '' : null);
    },
    setLoading(loading = true) {
        var _a;
        if (this.container === undefined)
            return;
        if (loading)
            this.container.append(magicDOM.createTree('div', 'loading--cover'));
        else
            (_a = this.container.querySelector('.loading--cover')) === null || _a === void 0 ? void 0 : _a.remove();
    },
    subWindowList: [],
    init(container, content) {
        var _a;
        if (typeof window === 'undefined' ||
            this.initialized)
            return;
        /** initialize container and content */
        let cont = $$(container);
        if (cont === null)
            return;
        this.container = cont;
        /** initialize components */
        this.component = magicDOM.createElement('div', { classList: 'nav' });
        this.block.left = magicDOM.createElement('div', { classList: 'nav--left' });
        this.block.right = magicDOM.createElement('div', { classList: 'nav--right' });
        this.tooltip = magicDOM.createTree('div', 'nav__tooltip', {}, {
            t: { classList: 'nav__tooltip__title' },
            d: { classList: 'nav__tooltip__description' }
        });
        this.underlay = magicDOM.createElement('div', { classList: 'nav__underlay' });
        this.underlay.onclick = () => {
            for (let item of this.subWindowList)
                if (item.isShowing)
                    item.hide(false);
            this.setUnderlay(false);
        };
        this.component.append(this.block.left, this.block.right, (_a = this.tooltip) !== null && _a !== void 0 ? _a : '', this.underlay);
        /** append */
        this.container.insertBefore(this.component, this.container.firstChild);
        /** stylesheet */
        const style = magicDOM.createElement('style');
        style.textContent = `
        ${container} {
            position: absolute;
            inset: 0;

            margin-block-start: var(--nav-height);

            display: flex;
            flex-direction: column;

            place-items: center;

            width: auto;
            height: auto;
        }


        ${content} {
            width: 100%;
            height: 100%;
        }
        `;
        this.container.append(style);
    },
    insert({ container }, location, order) {
        var _a;
        if (order)
            $(container).css({ order });
        (_a = this.block[location]) === null || _a === void 0 ? void 0 : _a.append(container);
    },
    addComponent: {
        logo({ logo = 'favicon.png', title = 'app', onlyActive = false } = {}) {
            const container = magicDOM.createTree('div', 'nav__logo', {}, {
                i: new Lazyload(logo, { classList: 'nav__logo__icon' }).component,
                t: { classList: 'nav__logo__title', children: title }
            });
            const tooltip = new Tooltip(container);
            const clicker = new Clicker(container, onlyActive);
            const subWindow = new SubWindow(container);
            navigation.insert({ container }, 'left', 1);
            return {
                container,
                tooltip,
                clicker,
                subWindow
            };
        },
        route(collection, spa = false) {
            if (typeof window === 'undefined' ||
                navigation.component === undefined)
                return;
            /** holder */
            const router = magicDOM.createElement('div', { classList: 'nav__component' });
            /** router background */
            Glasium.init(router, {
                count: 8,
                onMutation: {
                    rule() { return document.body.dataset.theme === 'dark'; },
                    false: { color: COLOR.WHITESMOKE },
                    true: { color: COLOR.DARK },
                    observing: document.body,
                    options: { attributeFilter: ['data-theme'] }
                }
            });
            /** route initialization */
            function createRoute({ href, icon }) {
                if (spa) {
                    const anchor = document
                        .querySelector(`[data-href='${href}']`);
                    if (anchor === null) {
                        let message = `'navigation.addComponent.route()' : missing href - ${href}`;
                        throw new Error(message);
                    }
                    anchor.classList.add('nav__link');
                    anchor.append(magicDOM.toHTMLElement(`<i class="fa-solid fa-${icon}"></i>`));
                    return anchor;
                }
                return magicDOM.createElement('div', {
                    classList: 'nav__link',
                    attribute: { 'data-href': href },
                    children: magicDOM.toHTMLElement(`<i class="fa-solid fa-${icon}"></i>`)
                });
            }
            let navigating = false;
            for (let item of collection) {
                /** make route */
                const route = createRoute(item);
                /** route appending */
                router.append(route);
                /** events */
                $(route).on('click', () => {
                    indicate(route);
                    if (navigating || spa)
                        return;
                    navigating = true;
                    navigation.setLoading(true);
                    new Promise((resolve) => {
                        window.setTimeout(resolve, 200);
                    }).then(() => window.location.pathname = item.href);
                });
                /** tooltip */
                new Tooltip(route).set(item.tooltip);
            }
            /** route indication */
            const indicator = magicDOM.createElement('div', {
                classList: 'nav__indicator'
            });
            navigation.component.append(indicator);
            function indicate(current = $$(`a[data-href="${pathname()}"]`)) {
                if (current === null)
                    return;
                $('a[data-current]').dataset('current', null);
                $(current).dataset('current', '');
                const { left, width } = current.getBoundingClientRect();
                $(indicator).css({
                    left: `${left}px`,
                    width: `${width}px`
                });
            }
            /** insert router */
            navigation.insert({ container: router }, 'left', 2);
            /** window change state */
            new MutationObserver(() => indicate())
                .observe(document.body, { childList: true, subtree: true });
        },
        hamburger() {
            const container = magicDOM.createElement('div', {
                classList: 'nav__hamburger', children: [
                    magicDOM.toHTMLElement(`
                        <div class='nav__hamburger__box'>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        `)
                ]
            });
            navigation.insert({ container }, 'right', 1);
            return new Component(container);
        },
        button({ alwaysActive = false, text = '', icon = 'code', image = undefined, color = 'BLUE' } = {}) {
            const container = magicDOM.createTree('span', ['nav__component', 'nav__button']);
            const tooltip = new Tooltip(container);
            const clicker = new Clicker(container, alwaysActive);
            const subWindow = new SubWindow(container);
            /** background */
            Glasium.init(container, {
                count: 8,
                color: typeof color === 'string' ? COLOR[color] : color,
            });
            /** icon */
            const iconNode = magicDOM.createElement('i', {
                classList: ['fa-solid', `fa-${icon}`],
                attribute: image ? { style: `display: none` } : {}
            });
            container.append(iconNode);
            /** image */
            const imageNode = new Lazyload(image, { classList: 'nav__button__image' });
            if (image === undefined)
                $(imageNode.component).css('display', 'none');
            container.append(imageNode.component);
            /** text */
            const textNode = magicDOM.createElement('div', {
                classList: 'nav__button__text', children: text
            });
            if (text === undefined || text === '')
                $(textNode).css('display', 'none');
            container.append(textNode);
            /** insert */
            navigation.insert({ container }, 'right', 3);
            return {
                container,
                tooltip,
                clicker,
                subWindow,
                get icon() { return icon; },
                get text() { return text; },
                get image() { return image ? image : ''; },
                get color() { return color; },
                set icon(iconName) {
                    $(iconNode).css('display', null);
                    $(imageNode.component).css('display', 'none');
                    iconNode.className = '';
                    iconNode.classList.add('fa-solid', `fa-${iconName}`);
                    icon = iconName;
                },
                set text(textContent) {
                    if (textContent) {
                        $(textNode).css('display', null);
                        textNode.textContent = textContent;
                        return;
                    }
                    $(textNode).css('display', '');
                    text = textContent ? textContent : '';
                },
                set image(imageSrc) {
                    $(iconNode).css('display', 'none');
                    $(imageNode.component).css('display', null);
                    imageNode.source = imageSrc;
                    image = imageSrc;
                },
                set color(colorName) {
                    Glasium.change(container, {
                        color: typeof colorName === 'string' ? COLOR[colorName] : colorName
                    });
                    color = colorName;
                }
            };
        },
        account() {
            const button = this.button({
                text: 'guest',
                image: 'guest.png',
                color: 'RED'
            });
            const { container, tooltip, clicker, subWindow } = button;
            clicker.onClick(() => subWindow.toggle());
            navigation.insert({ container }, 'right', 2);
            return {
                container,
                tooltip,
                clicker,
                subWindow,
                get avatar() {
                    return button.image;
                },
                get username() {
                    return button.text;
                },
                get color() {
                    return button.color;
                },
                set avatar(avatar) {
                    button.image = avatar;
                },
                set username(username) {
                    button.text = username;
                },
                set color(color) {
                    button.color = color;
                },
            };
        }
    },
    global: {}
};
class Tooltip {
    constructor(container) {
        this.title = '';
        this.description = '';
        this.flip = false;
        this.container = navigation.tooltip;
        /** as only when navigation is initialized do this be used */
        if (library.isMobile)
            return;
        $(container)
            .on('pointerenter', (event) => this.show(event))
            .on('pointerleave', () => this.hide())
            .on('pointerdown', () => this.hide());
    }
    set({ title = '', description = '', flip = false } = {}) {
        this.title = title;
        this.description = description;
        this.flip = flip;
    }
    show({ target }) {
        if (navigation.underlay &&
            navigation.underlay.classList.contains('nav__underlay--active'))
            return;
        if (navigation.component === undefined)
            return;
        if (this.title === '')
            return;
        this.container.t.textContent = this.title;
        this.container.d.textContent = this.description;
        const { innerWidth } = window;
        const { left, right } = target.getBoundingClientRect();
        const { width } = this.container.getBoundingClientRect();
        $(this.container)
            .css({
            left: this.flip ? null : `${left}px`,
            right: this.flip ? `${innerWidth - right}px` : null,
            textAlign: this.flip || left + width >= innerWidth ? 'right' : 'left'
        })
            .addClass('nav__tooltip--active');
        $(navigation.component).addClass('nav--decorating');
    }
    hide() {
        if (navigation.component === undefined)
            return;
        $(this.container).removeClass('nav__tooltip--active');
        $(navigation.component).removeClass('nav--decorating');
    }
}
class Clicker {
    constructor(container, onlyActive = false) {
        this.container = container;
        this.onlyActive = onlyActive;
        this.clickHandlers = [];
        this.__activated = false;
        if (onlyActive) {
            $(container).dataset('activated', '');
            this.__activated = true;
        }
        const clickBox = magicDOM.createTree('div', 'invisible');
        container.append(clickBox);
        $(clickBox).on('click', () => {
            if (onlyActive) {
                for (let f of this.clickHandlers)
                    f(true);
            }
            else {
                let isActive = container.dataset.activated === '';
                for (let f of this.clickHandlers)
                    f(!isActive);
                this.toggle(isActive);
            }
        });
        this.container.dataset.clicker = '';
    }
    get activated() { return this.__activated; }
    get toOnlyActive() { return this.onlyActive; }
    set toOnlyActive(onlyActive) {
        const dataset = onlyActive ? { activated: '', deactivated: null } : {};
        $(this.container).dataset(dataset);
        this.onlyActive = onlyActive;
    }
    onClick(func) {
        return this.clickHandlers.push(func);
    }
    offClick(id) {
        this.clickHandlers[id] = () => { };
    }
    toggle(isActive = this.activated) {
        this.__activated = !isActive;
        this[this.__activated ? 'show' : 'hide']();
    }
    show() {
        if (this.clickHandlers.length === 0)
            return;
        this.container.dataset.activated = '';
    }
    hide() { delete this.container.dataset.activated; }
}
class SubWindow {
    constructor(container, content = '...loading...') {
        this.container = container;
        /** props */
        this.__id = library.randomString();
        this.__isShowing = false;
        this.hideId = -1;
        /** handlers collection */
        this.toggleHandlers = [];
        /** nodes */
        this.windowNode = magicDOM.createElement('div', {
            classList: ['nav__sub-window'],
            attribute: { 'data-id': this.__id, 'data-deactivated': '' }
        });
        this.overlayNode = magicDOM.createElement('div', {
            classList: 'nav__sub-window__overlay',
            children: magicDOM.createTree('div', 'loading--cover')
        });
        this.contentNode = magicDOM.createElement('div', {
            classList: 'nav__sub-window__content'
        });
        /** initialize component */
        this.content = content;
        this.windowNode.append(this.contentNode, this.overlayNode);
        this.container.append(this.windowNode);
        navigation.subWindowList.push(this);
        /** observer */
        new ResizeObserver(() => this.update()).observe(this.container);
        new ResizeObserver(() => this.update()).observe(this.contentNode);
        $(window).on('resize', () => this.update());
    }
    /** getters */
    get id() { return this.__id; }
    get isShowing() { return this.__isShowing; }
    /** setters */
    set loading(loading) {
        $(this.overlayNode).css('display', loading ? 'block' : 'none');
    }
    set content(content) {
        magicDOM.emptyNode(this.contentNode);
        this.contentNode.append(content);
        this.update();
    }
    /** public funcs */
    update() {
        window.requestAnimationFrame(() => {
            if (navigation.container === undefined)
                return;
            const { clientWidth } = navigation.container;
            let height = this.isShowing ? this.contentNode.offsetHeight : 0;
            $(this.windowNode).css('--height', `${height}px`);
            let rect = this.container.getBoundingClientRect();
            let width = this.contentNode.offsetWidth;
            if (width - rect.right < 0)
                $(this.windowNode).dataset('align', 'right');
            else if (rect.left + width < clientWidth)
                $(this.windowNode).dataset('align', 'left');
            else {
                $(this.windowNode)
                    .dataset('align', 'expanded')
                    .css({
                    '--width': `${clientWidth}px`,
                    '--left': rect.left
                });
                return;
            }
            $(this.windowNode).css('--width', `${width}px`);
        });
    }
    show() {
        window.clearTimeout(this.hideId);
        for (let subWindow of navigation.subWindowList)
            if (subWindow.id !== this.id)
                subWindow.hide(false);
        navigation.setUnderlay(true);
        this.update();
        $(this.windowNode).dataset({
            'activated': '',
            'deactivated': null
        });
        $(this.container).dataset('activated', '');
        this.__isShowing = true;
        this.update();
    }
    hide(trusted = true) {
        if (trusted)
            navigation.setUnderlay(false);
        $(this.windowNode).dataset('activated', null);
        $(this.container).dataset('activated', null);
        this.__isShowing = false;
        this.update();
        this.hideId = window.setTimeout(() => {
            $(this.windowNode).dataset('deactivated', '');
        }, 300);
        this.update();
    }
    toggle() {
        this[this.isShowing ? 'hide' : 'show']();
        for (let f of this.toggleHandlers)
            f(this.isShowing);
    }
    onToggle(func) {
        this.toggleHandlers.push(func);
    }
}
export class Component {
    constructor(container) {
        this.container = container;
        this.tooltip = new Tooltip(this.container);
        this.clicker = new Clicker(this.container);
        this.subWindow = new SubWindow(this.container);
    }
}
export default navigation;
function pathname() {
    let path = window.location.pathname
        .split('/')[1]
        .split('?')
        .shift()
        .split('#')
        .shift();
    return `/${path}`;
}
