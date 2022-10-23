import { useCallback, useEffect, useState } from "react"
import { useEventListener } from "./use-event-listener"

export const initialStorage: Storage = Object.freeze({
    getItem(_key: string) {
        return null
    },
    clear() {},
    key: (_index: number) => {
        return null
    },
    length: 0,
    removeItem(_key: string) {},
    setItem(_key: string, _value: string) {},
})

export function useLocalStorage<T extends unknown>(
    key: string,
    initialValue: T
) {
    const [storage, setStorage] = useState(initialStorage)

    useEffect(() => {
        if (typeof window !== 'undefined')
            setStorage(localStorage)
    }, [setStorage])

    return useStorage(key, initialValue, storage)
}

export function useSessionStorage<T extends unknown>(
    key: string,
    initialValue: T
) {
    const [storage, setStorage] = useState(initialStorage)

    useEffect(() => {
        if (typeof window !== 'undefined')
            setStorage(sessionStorage)
    }, [setStorage])

    return useStorage(key, initialValue, storage)
}

export function useStorage<T extends unknown>(
    key: string,
    initialValue: T,
    storage: Storage
): {
    value: T,
    setValue: Fukumi.SetState<T>
    removeValue: () => void
} {
    const getValue = useCallback(() => {
        if (typeof window === "undefined") return initialValue

        try {
            const item = storage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading storage key “${key}”:`, error)
            return initialValue
        }
    }, [initialValue, key, storage])

    const [storedValue, setStoredValue] = useState<T>(getValue)

    const setValue: Fukumi.SetState<T> = useCallback(
        (value) => {
            // Prevent build error "window is undefined" but keeps working
            if (typeof window === "undefined") {
                console.warn(
                    `Tried setting storage key “${key}” even though environment is not a client`
                )
            }

            try {
                // Allow value to be a function so we have the same API as useState
                const newValue
                    = value instanceof Function ? value(storedValue) : value

                // Save to storage
                storage.setItem(key, JSON.stringify(newValue))

                // Save state
                setStoredValue(newValue)

                // We dispatch a custom event so every useStorage hook are notified
                window.dispatchEvent(new Event("storage"))
            } catch (error) {
                console.warn(`Error setting storage key “${key}”:`, error)
            }
        },
        [key, storage, storedValue, setStoredValue]
    )

    useEffect(() => {
        setStoredValue(getValue())
    }, [getValue])

    const handleStorageChange = useCallback(
        (event: StorageEvent) => {
            if (event.key !== key) return
            setStoredValue(getValue())
        },
        [key, getValue]
    )

    useEventListener("storage", handleStorageChange)

    return {
        value: storedValue,
        setValue,
        removeValue: () => setValue(initialValue)
    }
}
