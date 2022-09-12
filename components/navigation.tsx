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

    state: Fukumi.NavigationState = {
        mounted: false,
    }

    public static getDerivedStateFromProps(): null | Partial<Fukumi.NavigationState> {
        return {}
    }

    public componentDidMount(): void {
        this.setState({ mounted: true })
    }

    public render() {
        return (
            <div
                className={styles.container}
                ref={this.ref.container}
            >
                {/** style dom */}
                {!this.state.mounted || (
                    <style>
                        {`#${this.ref.container.current?.parentElement?.id} {
                            position: absolute;
                            inset: 0;

                            width: auto;
                            height: auto;

                            margin-block-start: ${this.CONSTANT.height};
                      }`}
                    </style>
                )}
            </div>
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

        interface NavigationState {
            mounted: boolean
        }
    }
}
