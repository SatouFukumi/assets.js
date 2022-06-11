import { $ } from './jquery.js';
import RecordAnimationFrame from './record-animation-frame.js';
import changeCase from './change-case.js';
import cursor from './cursor.js';
import library, { throttled } from './library.js';
import magicDOM from './magic-dom.js';
const OFFSET = 135;
const LARGE_X_AXIS = 0.75;
const LARGE_Y_AXIS = 0.77;
const MOUSE_OFFSET_X = 13;
const MOUSE_OFFSET_Y = 25;
const THROTTLE = 55;
const HIDE_DURATION = 200;
const DEACTIVATE_DURATION = 300;
export const tooltip = {
    get initialized() {
        return !!(this.container && this.content);
    },
    glowing: false,
    hideId: -1,
    deactivateId: -1,
    processor: {
        attribute: {
            process(target, key) {
                let attrValue = target.getAttribute(key);
                return attrValue ? attrValue : undefined;
            },
            attach(hook) {
                if (typeof window === 'undefined')
                    return;
                const key = hook.key;
                $(`[${key}]`).each(function () { tooltip.attach(this, hook); });
            }
        },
        dataset: {
            process(target, key) {
                let datasetKey = changeCase.kebab.camel(key);
                return target.dataset[datasetKey];
            },
            attach(hook) {
                if (typeof window === 'undefined')
                    return;
                const key = changeCase.camel.kebab(hook.key);
                $(`[data-${key}]`).each(function () { tooltip.attach(this, hook); });
            }
        }
    },
    process(target, { on, key }) {
        return this.processor[on].process(target, key);
    },
    attach(target, hook) {
        if (target.tooltipAttached ||
            this.process(target, hook) === undefined)
            return;
        /** key */
        let { key } = hook;
        if (hook.on === 'dataset')
            key = `data-${changeCase.camel.kebab(key)}`;
        /** observer */
        const observer = new MutationObserver(() => {
            this.pointerenter(target, hook);
        });
        /** attach event */
        $(target)
            .on('pointerenter', () => {
            observer.observe(target, { attributeFilter: [key] });
            this.pointerenter(target, hook);
        })
            .on('pointerleave', () => {
            observer.disconnect();
            this.pointerleave(hook);
        });
        /** init */
        target.tooltipAttached = true;
    },
    hooks: [
        {
            on: 'attribute',
            key: 'title',
            handler({ target, value }) {
                if (value === undefined)
                    return target.tipTitle;
                target.tipTitle = value;
                target.removeAttribute('title');
                return value;
            },
            follower() { },
            priority: 1,
            fit: false
        }
    ],
    init() {
        if (typeof window === 'undefined' ||
            library.isMobile ||
            this.initialized)
            return;
        /** watch cursor */
        cursor.watch(true);
        this.move.start(1);
        /** initialize the tooltip component */
        this.container = magicDOM.createElement('div', { classList: 'tooltip' });
        this.content = magicDOM.createElement('div', { classList: 'tooltip__content' });
        this.container.append(this.content);
        document.body.insertBefore(this.container, document.body.firstChild);
        /** first initialization */
        this.hide();
        this.scan();
        /** observer */
        new ResizeObserver(() => this.updateSize()).observe(this.content);
        new MutationObserver(() => this.scan())
            .observe(document.body, { childList: true, subtree: true });
        /** limit glowing effect */
        $(this.container).on('animationend', function () {
            $(this).dataset('glow', null);
            tooltip.glowing = false;
        });
    },
    scan() {
        this.hooks.forEach((hook) => {
            this.processor[hook.on].attach(hook);
        });
    },
    addHook(on, key, { handler = ({ value }) => value, follower = () => { }, priority = 1, fit = false } = {}) {
        const hook = { on, key, handler, follower, priority, fit };
        this.hooks.push(hook);
        /** sort hook by priority */
        this.hooks.sort((a, b) => {
            return b.priority - a.priority;
        });
        /** attach */
        this.processor[on].attach(hook);
    },
    pointerenter(target, hook) {
        if (this.container === undefined)
            return;
        /** content */
        const value = this.process(target, hook);
        const content = hook.handler({
            target,
            value,
            update: (content_) => this.update(content_)
        });
        /** fit option */
        if (hook.fit)
            $(this.container).dataset('fit', '');
        /** display content */
        if (content)
            this.show(content);
    },
    pointerleave(hook) {
        if (this.container === undefined)
            return;
        hook.follower();
        this.hide();
        if (hook.fit)
            $(this.container).dataset('fit', null);
    },
    show(content) {
        if (this.container === undefined)
            return;
        window.clearTimeout(this.hideId);
        window.clearTimeout(this.deactivateId);
        $(this.container).dataset({
            'activated': '',
            'deactivated': null
        });
        this.update(content);
        this.move.start();
    },
    hide() {
        if (this.container === undefined)
            return;
        const { container } = this;
        this.hideId = window.setTimeout(() => {
            $(container).dataset('activated', null);
            this.deactivateId = window.setTimeout(() => {
                $(container).dataset('deactivated', '');
                this.move.stop();
            }, DEACTIVATE_DURATION);
        }, HIDE_DURATION);
    },
    move: new RecordAnimationFrame(throttled(function () { tooltip.__move(); }, THROTTLE)),
    __move() {
        if (this.container === undefined)
            return;
        const { container } = this;
        const { innerWidth, innerHeight } = window;
        const { offsetWidth, offsetHeight } = container;
        const { positionX, positionY } = cursor;
        const isMoreOuterX = innerWidth * LARGE_X_AXIS < positionX;
        const isMoreOuterY = innerHeight * LARGE_Y_AXIS < positionY;
        const isLargerThanScreenX = innerWidth - offsetWidth - OFFSET < positionX;
        const isLargerThanScreenY = innerWidth - offsetHeight - OFFSET < positionY;
        const posX = (isMoreOuterX || isLargerThanScreenX)
            ? positionX - offsetWidth - MOUSE_OFFSET_X
            : positionX + MOUSE_OFFSET_X;
        const posY = (isMoreOuterY || isLargerThanScreenY)
            ? positionY - offsetHeight - MOUSE_OFFSET_Y
            : positionY + MOUSE_OFFSET_Y;
        $(container).css({
            '--position-x': posX,
            '--position-y': posY
        });
    },
    updateSize() {
        if (this.container === undefined ||
            this.content === undefined)
            return;
        $(this.container).css({
            '--width': this.content.offsetWidth,
            '--height': this.content.offsetHeight
        });
    },
    update(content) {
        if (this.content === undefined)
            return;
        this.glow();
        magicDOM.emptyNode(this.content);
        this.content.append(content);
    },
    glow() {
        if (this.glowing ||
            this.container === undefined)
            return;
        $(this.container).dataset('glow', '');
    }
};
export default tooltip;
