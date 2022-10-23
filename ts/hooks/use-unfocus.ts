import { RefObject, useRef } from "react"
import { useEventListener } from "./use-event-listener"

export function useUnfocus<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    cb: (e: MouseEvent) => any
) {
    useEventListener(
        "click",
        (e) => {
            if (
                ref.current === null
                || e.target === null
                || ref.current.contains(e.target as Node)
            )
                return
            cb(e)
        },
        useRef(document)
    )
}
