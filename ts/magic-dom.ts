declare global {
    namespace MagicDOM {
        interface TreeLeave {
            tag?: keyof HTMLElementTagNameMap
            classList?: string | string[]
            attribute?: Record<string, string | number>
            children?: Record<string, TreeLeave> | string | HTMLElement | HTMLElement[]
        }

        type HTMLTree = any
    }
}

/** */
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
    createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        {
            id,
            classList,
            attribute,
            children,
        }: {
            id?: string
            classList?: string | string[]
            attribute?: Record<string, string | number>
            children?: string | HTMLElement | HTMLElement[]
        } = {}
    ): HTMLElementTagNameMap[K] {
        const container: HTMLElementTagNameMap[K] = document.createElement(tagName)

        /** add id to the container */
        if (id) container.id = id

        /** add class list to the container */
        if (typeof classList === "string") container.classList.add(classList)

        if (classList instanceof Array) container.classList.add(...classList)

        /** add attribute to the container */
        if (attribute)
            for (let value in attribute)
                container.setAttribute(value, attribute[value]?.toString())

        /** append child to the container */
        if (typeof children === "string") container.textContent = children

        if (children instanceof HTMLElement) container.appendChild(children)

        if (children instanceof Array) container.append(...children)

        return container
    },

    /**
     * @warn there is no advanced type checking for this
     */
    createTree<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        classList: string | string[] = [],
        attribute: Record<string, string | number> = {},
        children:
            | string
            | HTMLElement
            | HTMLElement[]
            | Record<string, MagicDOM.TreeLeave | HTMLElement> = []
    ): MagicDOM.HTMLTree {
        let container: HTMLElementTagNameMap[K] & {
            [key: string]: any
        } = magicDOM.createElement(tag, { classList, attribute })

        if (children === undefined) return container

        if (typeof children === "string") {
            container.innerText = children
            return container
        }

        if (children instanceof HTMLElement) {
            container.appendChild(children)
            return container
        }

        if (children instanceof Array) {
            container.append(...children)
            return container
        }

        for (let key in children) {
            const child: MagicDOM.TreeLeave | HTMLElement = children[key]

            if (child instanceof HTMLElement) {
                container.append(child)
                container[key] = child
                continue
            }

            const tag_: keyof HTMLElementTagNameMap = child.tag ? child.tag : "div"
            const classList_: string | string[] | undefined = child.classList
            const attribute_: Record<string, string | number> | undefined =
                child.attribute
            const children_: MagicDOM.TreeLeave["children"] = child.children

            const child_: any = magicDOM.createTree(
                tag_,
                classList_,
                attribute_,
                children_
            )

            container.appendChild(child_)
            container[key] = child_
        }

        return container
    },

    /**
     * empty node
     * @param { HTMLElement } node node to empty
     */
    emptyNode(node: HTMLElement): void {
        while (node.firstChild) node.firstChild.remove()
    },

    /** this function only return the first child */
    toHTMLElement<T extends HTMLElement>(htmlString: string): T {
        const template: HTMLTemplateElement = document.createElement("template")
        template.innerHTML = htmlString.trim()

        const fin: ChildNode | null = template.content.firstChild
        if (fin === null) throw new Error(`'magicDOM.toHTMLElement()' : can't`)
        template.remove()

        return fin as T
    },
}

export default magicDOM
