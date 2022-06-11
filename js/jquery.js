import changeCase from './change-case';
class JHTMLElement extends Array {
    css(a, b) {
        this.forEach((element) => {
            if (!(element instanceof HTMLElement))
                return;
            if (typeof a === 'string' && b !== undefined) {
                b = typeof b === 'number' ? b.toString() : b;
                element.style.setProperty(changeCase.camel.kebab(a), b);
            }
            if (a instanceof Object)
                for (let key in a) {
                    const prop = changeCase.camel.kebab(key);
                    let value = a[key];
                    value = typeof value === 'number' ? value.toString() : value;
                    element.style.setProperty(prop, value);
                }
        });
        return this;
    }
    attr(a, b) {
        this.forEach((element) => {
            if (!(element instanceof HTMLElement))
                return;
            if (typeof a === 'string' && b !== undefined)
                if (b === null)
                    element.removeAttribute(a);
                else
                    element.setAttribute(a, b);
            if (a instanceof Object)
                for (let key in a) {
                    const name = key;
                    const value = a[key];
                    if (value === null)
                        element.removeAttribute(name);
                    else
                        element.setAttribute(name, value);
                }
        });
        return this;
    }
    dataset(a, b) {
        this.forEach(function (element) {
            if (!(element instanceof HTMLElement))
                return;
            if (typeof a === 'string' && b === null)
                delete element.dataset[a];
            if (typeof a === 'string' && typeof b === 'string')
                element.dataset[a] = b;
            if (a instanceof Object)
                for (let key in a) {
                    const value = a[key];
                    if (value === null)
                        delete element.dataset[key];
                    else
                        element.dataset[key] = value;
                }
        });
        return this;
    }
    each(func) {
        if (typeof func !== 'function')
            throw new Error('"jquery.each()" : "func" is not a function');
        this.forEach((element, index) => func.call(element, index));
        return this;
    }
    remove() {
        this.forEach(function (element) {
            if (element instanceof HTMLElement)
                element.remove();
        });
        return this;
    }
    append(...nodes) {
        this.forEach(function (element) {
            if (element instanceof HTMLElement)
                element.append(...nodes);
        });
        return this;
    }
    on(a, b, c) {
        if (typeof a !== 'string')
            throw new Error(`'JQuery.on() : 'event' is not valid`);
        if (typeof b !== 'function')
            throw new Error(`'JQuery.on() : 'listener' is not valid`);
        this.forEach((element) => element.addEventListener(a, b, c));
        return this;
    }
    off(a, b, c) {
        if (typeof a !== 'string')
            throw new Error(`'JQuery.on() : 'event' is not valid`);
        if (typeof b !== 'function')
            throw new Error(`'JQuery.on() : 'listener' is not valid`);
        this.forEach((element) => element.removeEventListener(a, b, c));
        return this;
    }
    addClass(...className) {
        this.forEach(function (element) {
            if (!(element instanceof HTMLElement))
                return;
            element.classList.add(...className);
        });
        return this;
    }
    removeClass(...className) {
        this.forEach(function (element) {
            if (!(element instanceof HTMLElement))
                return;
            element.classList.remove(...className);
        });
        return this;
    }
    toggleClass(className) {
        this.forEach(function (element) {
            if (!(element instanceof HTMLElement))
                return;
            element.classList.toggle(className);
        });
        return this;
    }
}
export function $$(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
        const container = document.querySelector(b);
        if (container === null)
            return null;
        return container.querySelector(a);
    }
    if (typeof a === 'string' && b instanceof HTMLElement)
        return b.querySelector(a);
    return document.querySelector(a);
}
export function $(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
        const container = document.querySelector(b);
        const qsa = container === null || container === void 0 ? void 0 : container.querySelectorAll(a);
        const elements = qsa ? qsa : [];
        return new JHTMLElement(...elements);
    }
    if (typeof a === 'string' && b instanceof HTMLElement)
        return new JHTMLElement(...b.querySelectorAll(a));
    if (typeof a === 'string')
        return new JHTMLElement(...document.querySelectorAll(a));
    if (a instanceof NodeList)
        return new JHTMLElement(...a);
    if (a instanceof HTMLElement)
        return new JHTMLElement(a);
    return new JHTMLElement(a);
}
const jquery = { $, $$ };
export default jquery;
