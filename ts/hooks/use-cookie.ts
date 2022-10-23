import { useCallback, useEffect, useState } from "react"
import { useEventListener } from "./use-event-listener"

export function useCookie<T extends unknown>(key: string, initialValue: T) {
    const [cookie, setCookie] = useState<any>({})

    useEffect(() => {
        if (typeof window === 'undefined') return

        try {
            if (document.cookie === '') document.cookie = '{}' 
            setCookie(JSON.parse(document.cookie))
        } catch (error) {
            console.warn(`Error reading cookie key “${key}”:`, error)
        }
    }, [setCookie, key])
    
    const getValue = useCallback(() => {
        if (typeof window === 'undefined') return initialValue

        try {
            const item = cookie[key]
            return item ? item as T : initialValue
        } catch (error) {
            console.warn(`Error reading cookie key “${key}”:`, error)
            return initialValue
        }
    }, [initialValue, key, cookie])
    
    const [storedValue, setStoredValue] = useState<T>(getValue)

    const setValue: Fukumi.SetState<T> = useCallback(
        (v) => {
            // Prevent build error "window is undefined" but keeps working
            if (typeof window === "undefined") {
                console.warn(
                    `Tried setting localStorage key “${key}” even though environment is not a client`
                )
            }

            try {
                // Allow value to be a function so we have the same API as useState
                const newValue
                    = storedValue instanceof Function ? storedValue(storedValue) : storedValue

                // Save to cookie
                cookie[key] = newValue
                document.cookie = JSON.stringify(cookie)

                // Save state
                setStoredValue(newValue)

                // We dispatch a custom event so every useStorage hook are notified
                window.dispatchEvent(new CustomEvent("cookie", { detail: {key} }))
            } catch (error) {
                console.warn(`Error setting localStorage key “${key}”:`, error)
            }
        },
        [key, storedValue, setStoredValue, cookie]
    )

    useEffect(() => {
        setStoredValue(getValue())
    }, [getValue])

    const handleCookieChange = useCallback(
        (event: Fukumi.CookieEvent) => {
            if (event.detail.key !== key) return
            setStoredValue(getValue())
        },
        [getValue, key]
    )

    useEventListener('cookie', handleCookieChange)

    return {
        value: storedValue,
        setValue,
        removeValue: () => setValue(initialValue)
    }
}

declare global {
    namespace Fukumi {
        interface CookieEvent extends CustomEvent {
            detail: { key: string }
        }
    }

    interface WindowEventMap {
        cookie: Fukumi.CookieEvent
    }
}
