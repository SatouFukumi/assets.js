import type { RefObject } from "react"
import { useEffect, useState } from "react"
import { throttled } from "@ts/libraries"

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
    ref,
    options,
    onIntersect,
}: {
    ref: RefObject<T>
    onIntersect: (entry: IntersectionObserverEntry) => any
    options?: IntersectionObserverInit
}) {
    useEffect(() => {
        if (!ref.current) return

        const observer = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => onIntersect(entry),
            options
        )

        observer.observe(ref.current)

        return observer.disconnect.bind(observer)
    }, [ref, options, onIntersect])
}

export function useMutationObserver<T extends HTMLElement = HTMLElement>({
    ref,
    onMutate,
    options = {},
}: {
    ref: RefObject<T>
    onMutate: (record: MutationRecord) => void
    options?: MutationObserverInit
}) {
    useEffect(() => {
        if (!ref.current) return

        const obs = new MutationObserver(([record]) => {
            onMutate?.(record)
        })
        obs.observe(ref.current, options)

        return obs.disconnect.bind(obs)
    }, [ref, onMutate, options])
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>({
    ref,
    onResize,
    throttle = 0,
    options = {},
}: {
    ref: RefObject<T>
    onResize?: (entry: ResizeObserverEntry) => void
    throttle?: number
    options?: ResizeObserverOptions
}): Fukumi.UseResizeObserverObject {
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        if (!ref.current) return

        const obs = new ResizeObserver(
            throttled(([entry]: ResizeObserverEntry[]) => {
                setSize({
                    width: entry.borderBoxSize[0].inlineSize,
                    height: entry.borderBoxSize[0].blockSize,
                })

                onResize?.(entry)
            }, throttle)
        )
        obs.observe(ref.current, options)

        return obs.disconnect.bind(obs)
    }, [ref, throttle, options, onResize, setSize])

    return { ...size }
}

export function useResizeCallback<T extends HTMLElement = HTMLElement>({
    ref,
    onResize,
    throttle = 0,
    options = {},
}: {
    ref: RefObject<T>
    onResize?: (entry: ResizeObserverEntry) => void
    throttle?: number
    options?: ResizeObserverOptions
}) {
    useEffect(() => {
        if (!ref.current) return

        const obs = new ResizeObserver(
            throttled(
                ([entry]: ResizeObserverEntry[]) => onResize?.(entry),
                throttle
            )
        )
        obs.observe(ref.current, options)

        return obs.disconnect.bind(obs)
    }, [throttle, ref, options, onResize])
}

declare global {
    namespace Fukumi {
        interface UseResizeObserverObject {
            width: number
            height: number
        }
    }
}
