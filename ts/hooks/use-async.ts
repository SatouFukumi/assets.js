import { useCallback, useEffect, useState } from "react"

export function useAsync<T extends any>(
    callback: () => Promise<T>,
    deps: any[] = []
): Fukumi.UseAsyncReturn<T> {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [data, setData] = useState<T>()

    const callbackMemoized = useCallback(() => {
        setLoading(true)
        setError(undefined)
        setData(undefined)
        callback()
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return { loading, error, data }
}

declare global {
    namespace Fukumi {
        interface UseAsyncReturn<T extends any> {
            loading: boolean
            error: undefined | Error
            data: T | undefined
        }
    }
}
