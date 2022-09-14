import { Component } from "react"
import { ScrollbarProps, Scrollbars } from "react-custom-scrollbars-2"
import classNames from "classnames"

import styles from "@styles/components/scroll-box.module.scss"

/** */
export default class ScrollBox extends Component<ScrollbarProps> {
    render(): React.ReactNode {
        const className: string = this.props.className
            ? classNames({
                  [styles.container]: true,
                  [this.props.className]: true,
              })
            : styles.container

        return (
            <Scrollbars
                renderView={(props: any): JSX.Element => (
                    <div
                        {...props}
                        className={styles.view}
                    />
                )}
                renderThumbHorizontal={(props: any): JSX.Element => (
                    <div
                        {...props}
                        className={styles.thumb}
                    />
                )}
                renderThumbVertical={(props: any): JSX.Element => (
                    <div
                        {...props}
                        className={styles.thumb}
                    />
                )}
                {...this.props}
                className={className}
                universal
            />
        )
    }
}
