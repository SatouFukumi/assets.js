import { useCallback, useEffect, useState } from "react"

export function useAsync<T extends any>(
    callback: () => Promise<T>,
    deps: any[] = []
): {
    loading: boolean
    error: undefined
    value: T | undefined
} {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [value, setValue] = useState<T>()

    const callbackMemoized = useCallback(() => {
        setLoading(true)
        setError(undefined)
        setValue(undefined)
        callback()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return { loading, error, value }
}
