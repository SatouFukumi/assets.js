import { throttle } from "@ts/libraries"
import { useCallback, useEffect, useRef, useState } from "react"

export function useGeolocation({
    options = {},
    throttleMs = 1000,
}: Fukumi.UseGeolocationProps = {}): Fukumi.UseGeolocationReturn {
    const [geoPosition, setGeoPosition] = useState<GeolocationPosition>()
    const [error, setError] = useState<GeolocationPositionError>()

    const stopRef = useRef(false)
    const watchIdRef = useRef<number>(-1)
    const watchingRef = useRef<boolean>(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const positionSetter = useCallback(throttle(setGeoPosition, throttleMs), [
        setGeoPosition,
    ])

    const startWatch = useCallback(() => {
        if (watchingRef.current) return

        watchIdRef.current = navigator.geolocation.watchPosition(
            positionSetter,
            setError,
            options
        )
    }, [options, positionSetter])
    const clearWatch = useCallback(() => {
        navigator.geolocation.clearWatch(watchIdRef.current)

        watchingRef.current = false
    }, [])

    useEffect(() => {
        if (stopRef.current) return
        if (!!geoPosition) stopRef.current = true

        navigator.geolocation.getCurrentPosition(setGeoPosition, setError, options)

        return () => clearWatch()
    }, [geoPosition, options, clearWatch])

    return {
        geoPosition,
        error,
        startWatch,
        clearWatch,
    }
}

declare global {
    namespace Fukumi {
        interface UseGeolocationProps {
            options?: PositionOptions
            throttleMs?: number
        }

        interface UseGeolocationReturn {
            geoPosition: GeolocationPosition | undefined
            error: GeolocationPositionError | undefined
            clearWatch: () => void
            startWatch: () => void
        }
    }
}
