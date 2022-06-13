export const magicDOM = {
    /**
        * Create a HTMLElement the easy way
        * @param       tagName             HTMLElement type
        * @param       prop                HTMLElement prop
        * @param       prop.id             HTMLElement id
        * @param       prop.classList      HTMLElement class list
        * @param       prop.attribute      HTMLElement attribute
        * @param       prop.child          HTMLElement child
        */
    createElement(tagName, { id, classList, attribute, children } = {}) {
        var _a;
        const container = document.createElement(tagName);
        /** add id to the container */
        if (id)
            container.id = id;
        /** add class list to the container */
        if (typeof classList === 'string')
            container.classList.add(classList);
        if (classList instanceof Array)
            container.classList.add(...classList);
        /** add attribute to the container */
        if (attribute)
            for (let value in attribute)
                container.setAttribute(value, (_a = attribute[value]) === null || _a === void 0 ? void 0 : _a.toString());
        /** append child to the container */
        if (typeof children === 'string')
            container.textContent = children;
        if (children instanceof HTMLElement)
            container.appendChild(children);
        if (children instanceof Array)
            container.append(...children);
        return container;
    },
    /**
     * @warn there is no advanced type checking for this
     */
    createTree(tag, classList = [], attribute = {}, children = []) {
        let container = magicDOM.createElement(tag, { classList, attribute });
        if (children === undefined)
            return container;
        if (typeof children === 'string') {
            container.innerText = children;
            return container;
        }
        if (children instanceof HTMLElement) {
            container.appendChild(children);
            return container;
        }
        if (children instanceof Array) {
            container.append(...children);
            return container;
        }
        for (let key in children) {
            const child = children[key];
            if (child instanceof HTMLElement) {
                container.append(child);
                Object.assign(container, { [key]: child });
                continue;
            }
            const tag_ = child.tag ? child.tag : 'div';
            const classList_ = child.classList;
            const attribute_ = child.attribute;
            const children_ = child.children;
            const child_ = magicDOM.createTree(tag_, classList_, attribute_, children_);
            container.appendChild(child_);
            Object.assign(container, { [key]: child_ });
        }
        return container;
    },
    /**
    * empty node
    * @param { HTMLElement } node node to empty
    */
    emptyNode(node) {
        while (node.firstChild)
            node.firstChild.remove();
    },
    /** this function only return the first child */
    toHTMLElement(htmlString) {
        const template = document.createElement("template");
        template.innerHTML = htmlString.trim();
        const fin = template.content.firstChild;
        if (fin === null)
            throw new Error(`'magicDOM.toHTMLElement()' : can't`);
        template.remove();
        return fin;
    },
};
export default magicDOM;
