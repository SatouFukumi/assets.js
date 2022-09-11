import { Component, createRef } from "react"

import styles from "@styles/components/navigation.module.scss"

export class Navigation extends Component {
    private ref: Fukumi.NavigationRef = {
        container: createRef<HTMLDivElement>(),
    }

    private CONSTANT = Object.freeze({
        height: styles.height,
    })

    public componentDidMount(): void {
        if (!this.ref.container) return

        const stylesheet = document.createElement("style")
        stylesheet.textContent = `
            #${this.ref.container.current?.parentElement?.id} {
                position: absolute;
                inset: 0;

                width: auto;
                height: auto;

                margin-block-start: ${this.CONSTANT.height};
            }
        `

        this.ref.container.current?.parentElement?.append(stylesheet)
    }

    public render() {
        return (
            <div
                className={styles.container}
                ref={this.ref.container}
            ></div>
        )
    }
}

declare global {
    namespace Fukumi {
        interface NavigationRef {
            container: React.RefObject<HTMLDivElement>
        }
    }
}
