import { useCallback, useEffect, useRef, useState } from "react"

export function useInterval(callback: () => any, ms: number) {
    const intervalIdRef = useRef<NodeJS.Timer>()
    const [play, setPlay] = useState(true)

    useEffect(() => {
        intervalIdRef.current = setInterval(() => {
            if (play) callback()
        }, ms)

        return () => clearInterval(intervalIdRef.current)
    }, [callback, ms, play])

    return {
        start() {
            if (play) return
            setPlay(true)
        },

        stop() {
            if (!play) return
            setPlay(false)
        },
    } as const
}

const intervalBucketRcd: Record<number, Fukumi.UseIntervalBucket> = {}

const intervalBucket = (ms: number): Fukumi.UseIntervalBucket => {
    let bucket = intervalBucketRcd[ms]

    if (!bucket) {
        bucket = {
            callbacks: [],
            ms,
            interval: setInterval(() => {
                bucket.callbacks.forEach((f) => f())
            }, ms),
        }
        intervalBucketRcd[ms] = bucket
    }

    return bucket
}

function addToIntervalBucket(ms: number, callback: () => any) {
    const bucket = intervalBucket(ms)

    bucket.callbacks.push(callback)
}

function removeFromIntervalBucket(ms: number, callback: () => any) {
    const bucket = intervalBucket(ms)

    bucket.callbacks = bucket.callbacks.filter((c) => c !== callback)

    if (bucket.callbacks.length === 0) {
        clearInterval(bucket.interval)
        delete intervalBucketRcd[ms]
    }
}

export function useSynchronizedInterval(
    callback: () => any,
    ms: number
) {
    const [play, setPlay] = useState(true)

    const cb = useCallback(() => {
        if (play) callback()
    }, [callback, play])

    useEffect(() => {
        addToIntervalBucket(ms, cb)
        
        return () => {
            removeFromIntervalBucket(ms, cb)
        }
    }, [cb, ms])

    return {
        start: () => setPlay(true),
        stop: () => setPlay(false)
    }
}


declare global {
    namespace Fukumi {

        interface UseIntervalBucket {
            ms: number
            callbacks: (() => any)[]
            interval: NodeJS.Timer
        }
    }
}
