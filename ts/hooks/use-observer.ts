import { RefObject, useEffect, useState } from "react"

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

    return { ref }
}

export function useMutationObserver<T extends HTMLElement = HTMLElement>({
    ref,
    onMutate,
    options = {},
}: {
    ref: RefObject<T>
    onMutate: (record: MutationRecord) => void
    options?: MutationObserverInit
}): Fukumi.UseMutationObserverObject<T> {
    useEffect(() => {
        if (!ref.current) return

        const obs = new MutationObserver(([record]) => {
            onMutate?.(record)
        })
        obs.observe(ref.current, options)

        return obs.disconnect.bind(obs)
    }, [ref, onMutate, options])

    return { ref }
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>({
    ref,
    onResize,
    throttle = 0,
}: {
    ref: RefObject<T>
    onResize?: (entry: ResizeObserverEntry) => void
    throttle?: number
}): Fukumi.UseResizeObserverObject<T> {
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
        obs.observe(ref.current)

        return obs.disconnect.bind(obs)
    }, [ref, throttle, onResize, setSize])

    return { ...size, ref }
}

export function useResizeCallback<T extends HTMLElement = HTMLElement>({
    ref,
    onResize,
    throttle = 0,
}: {
    ref: RefObject<T>
    onResize?: (entry: ResizeObserverEntry) => void
    throttle?: number
}) {
    useEffect(() => {
        if (!ref.current) return

        const obs = new ResizeObserver(
            throttled(
                ([entry]: ResizeObserverEntry[]) => onResize?.(entry),
                throttle
            )
        )
        obs.observe(ref.current)

        return obs.disconnect.bind(obs)
    }, [throttle, onResize, ref])
}

declare global {
    namespace Fukumi {
        interface UseResizeObserverObject<T extends HTMLElement = HTMLElement> {
            width: number
            height: number
            ref: RefObject<T>
        }

        interface UseMutationObserverObject<T extends HTMLElement = HTMLElement> {
            ref: RefObject<T>
        }
    }
}
