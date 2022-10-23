import { useState } from "react"

import { useSynchronizedInterval } from "./use-interval"

export function useClock(ms: number = 1000) {
    const [now, setNow] = useState(new Date())

    useSynchronizedInterval(() => setNow(new Date()), ms)

    return now
}
