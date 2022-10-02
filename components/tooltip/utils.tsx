import { createContext } from "react"

import styles from "@styles/components/tooltip.module.scss"

export const TooltipContext: React.Context<Fukumi.TooltipContext> =
    createContext<Fukumi.TooltipContext>({
        setPadding: (
            value: boolean | ((prevState: boolean) => boolean)
        ): void => {},
        setShow: (
            value: boolean | ((prevState: boolean) => boolean)
        ): void => {},
        setContent: (
            value:
                | Fukumi.TooltipContent
                | ((prevState: Fukumi.TooltipContent) => Fukumi.TooltipContent)
        ): void => {},
    })

const duration: number = parseInt(styles.duration)
export const CONSTANT = {
    offset: 135,

    largeXAxis: 0.75,
    largeYAxis: 0.77,
    mouseOffsetX: 13,
    mouseOffsetY: 25,

    throttle: duration / 6 + 5,

    hideTimeout: duration - 200,
    deactivateTimeout: duration,
}

declare global {
    namespace Fukumi {
        interface TooltipContext {
            setPadding: React.Dispatch<React.SetStateAction<boolean>>
            setShow: React.Dispatch<React.SetStateAction<boolean>>
            setContent: React.Dispatch<
                React.SetStateAction<Fukumi.TooltipContent>
            >
        }
    }
}
