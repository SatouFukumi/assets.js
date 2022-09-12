import { Component, createRef } from "react"

import styles from "@styles/components/navigation.module.scss"

export class Navigation extends Component<
    Fukumi.NavigationProps,
    Fukumi.NavigationState
> {
    private ref: Fukumi.NavigationRef = {
        container: createRef<HTMLDivElement>(),
    }

    private CONSTANT: Fukumi.NavigationConstant = Object.freeze({
        height: styles.height,
    })

    state: Fukumi.NavigationState = {}

    public static getDerivedStateFromProps(): null | Partial<Fukumi.NavigationState> {
        return {}
    }

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
        interface NavigationProps {}

        interface NavigationRef {
            container: React.RefObject<HTMLDivElement>
        }

        interface NavigationConstant {
            readonly height: string
        }

        interface NavigationState {}
    }
}
