import { useMemo } from "react"

import RecordAnimationFrame from "@ts/record-animation-frame"

export function useRequestAnimationFrame(callback: (args: any) => any) {
    const record = useMemo(() => new RecordAnimationFrame(callback), [callback])

    return {
        start: record.start.bind(record),
        stop: record.stop.bind(record),
    }
}
