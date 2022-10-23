import { useEffect, useRef } from "react"

export function useTimeout(callback: () => any, ms: number) {
    const timeoutIdRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = setTimeout(callback, ms)

        return () => clearTimeout(timeoutIdRef.current)
    }, [ms, callback,])

    function clear() {
        clearTimeout(timeoutIdRef.current)
        return { reset, clear } as const
    }

    function reset() {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = setTimeout(callback, ms)
    }

    return { reset, clear } as const
}
