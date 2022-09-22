import { Component } from "react"
import { ScrollbarProps, Scrollbars } from "react-custom-scrollbars-2"
import classNames from "classnames"

import styles from "@styles/components/scroll-box.module.scss"

/** */
export default function ScrollBox(props: Fukumi.ScrollBoxProps): JSX.Element {
    const className: string = props.className
        ? classNames({
              [styles.container]: true,
              [props.className]: true,
          })
        : styles.container

    props = { ...props, curve: props.curve?.toString() }

    return (
        <Scrollbars
            renderView={(childProps: any): JSX.Element => (
                <div
                    {...childProps}
                    className={styles.view}
                    data-border-radius={props.curve}
                />
            )}
            renderThumbHorizontal={(childProps: any): JSX.Element => (
                <div
                    {...childProps}
                    className={styles.thumb}
                />
            )}
            renderThumbVertical={(childProps: any): JSX.Element => (
                <div
                    {...childProps}
                    className={styles.thumb}
                />
            )}
            {...props}
            className={className}
            universal
        />
    )
}

declare global {
    namespace Fukumi {
        interface ScrollBoxProps extends ScrollbarProps {
            curve?: boolean | string | undefined
        }
    }
}
