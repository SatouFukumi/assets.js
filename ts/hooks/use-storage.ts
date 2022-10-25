import { useCallback, useEffect, useState } from "react"
import { useEventListener } from "./use-event-listener"

function JSONParser<T extends unknown>(v: any): T {
    try {
        const v_ = JSON.parse(v)

        return typeof v_ === "string" ? (v_ as T) : v
    }
    catch (error) {
        return v as T
    }
}

export function useLocalStorage<T extends unknown>(
    key: string,
    initialValue: T,
    { parser = JSON.parse }: { parser?: (value: any) => T } = {}
): Fukumi.UseStorageReturn<T> {
    // Get from local storage then
    // parse stored json or return initialValue
    const getValue = useCallback((): T => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window === "undefined") return initialValue

        try {
            const item = localStorage.getItem(key)

            if (item === null) {
                localStorage.setItem(
                    key,
                    typeof initialValue === "string"
                        ? initialValue
                        : JSON.stringify(initialValue)
                )
                return initialValue
            }

            return typeof initialValue === "string"
                ? JSONParser(item)
                : (parser(JSONParser(item)) as T)
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error)

            return initialValue
        }
    }, [initialValue, key, parser])

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(getValue)

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue: Fukumi.SetState<T> = useCallback(
        (sta) => {
            // Prevent build error "window is undefined" but keeps working
            if (typeof window === "undefined") {
                console.warn(
                    `Tried setting localStorage key “${key}” even though environment is not a client`
                )
            }

            try {
                // Allow value to be a function so we have the same API as useState
                const newValue = sta instanceof Function ? sta(storedValue) : sta

                // Save to local storage
                localStorage.setItem(
                    key,
                    typeof newValue === "string"
                        ? newValue
                        : JSON.stringify(newValue)
                )

                // Save state
                setStoredValue(newValue)

                // We dispatch a custom event so every useLocalStorage hook are notified
                dispatchEvent(
                    new CustomEvent("local-storage", {
                        detail: { key },
                    })
                )
            } catch (error) {
                console.warn(`Error setting localStorage key “${key}”:`, error)
            }
        },
        [key, storedValue]
    )

    useEffect(() => {
        setStoredValue(getValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStorageChange = useCallback(
        (event: WindowEventMap["local-storage"]) => {
            if (event.detail.key !== key) return

            setStoredValue(getValue())
        },
        [key, getValue]
    )

    // this is a custom event, triggered in writeValueToLocalStorage
    useEventListener("local-storage", handleStorageChange)

    return {
        value: storedValue,
        setValue,
        removeValue: () => setValue(initialValue),
    }
}

export function useSessionStorage<T extends unknown>(
    key: string,
    initialValue: T,
    { parser = JSON.parse }: { parser?: (value: any) => T } = {}
): Fukumi.UseStorageReturn<T> {
    // Get from local storage then
    // parse stored json or return initialValue
    const getValue = useCallback((): T => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window === "undefined") return initialValue

        try {
            const item = sessionStorage.getItem(key)

            if (item === null) {
                sessionStorage.setItem(
                    key,
                    typeof initialValue === "string"
                        ? initialValue
                        : JSON.stringify(initialValue)
                )
                return initialValue
            }

            return typeof initialValue === "string"
                ? JSONParser(item)
                : (parser(JSONParser(item)) as T)
        } catch (error) {
            console.warn(`Error reading sessionStorage key “${key}”:`, error)

            return initialValue
        }
    }, [initialValue, key, parser])

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(getValue)

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to sessionStorage.
    const setValue: Fukumi.SetState<T> = useCallback(
        (sta) => {
            // Prevent build error "window is undefined" but keeps working
            if (typeof window === "undefined") {
                console.warn(
                    `Tried setting sessionStorage key “${key}” even though environment is not a client`
                )
            }

            try {
                // Allow value to be a function so we have the same API as useState
                const newValue = sta instanceof Function ? sta(storedValue) : sta

                // Save to local storage
                sessionStorage.setItem(
                    key,
                    typeof newValue === "string"
                        ? newValue
                        : JSON.stringify(newValue)
                )

                // Save state
                setStoredValue(newValue)

                // We dispatch a custom event so every useSessionStorage hook are notified
                dispatchEvent(
                    new CustomEvent("local-storage", {
                        detail: { key },
                    })
                )
            } catch (error) {
                console.warn(`Error setting sessionStorage key “${key}”:`, error)
            }
        },
        [key, storedValue]
    )

    useEffect(() => {
        setStoredValue(getValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStorageChange = useCallback(
        (event: WindowEventMap["local-storage"]) => {
            if (event.detail.key !== key) return

            setStoredValue(getValue())
        },
        [key, getValue]
    )

    // this is a custom event, triggered in writeValueToSessionStorage
    useEventListener("local-storage", handleStorageChange)

    return {
        value: storedValue,
        setValue,
        removeValue: () => setValue(initialValue),
    }
}

declare global {
    namespace Fukumi {
        interface UseStorageReturn<T extends unknown> {
            value: T
            setValue: SetState<T>
            removeValue: () => void
        }
    }

    interface WindowEventMap {
        "local-storage": CustomEvent<{ key: string }>
    }
}
