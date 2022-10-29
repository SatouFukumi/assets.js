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

    return { loading, error, data } as any
}

declare global {
    namespace Fukumi {
        type UseAsyncReturn<T> =
            | UseAsyncReturnDone<T>
            | UseAsyncReturnLoading
            | UseAsyncReturnError

        interface UseAsyncReturnDone<T> {
            loading: false
            error: undefined
            data: T
        }

        interface UseAsyncReturnLoading {
            loading: true
            error: undefined
            data: undefined
        }

        interface UseAsyncReturnError {
            loading: false
            error: Error
            data: undefined
        }
    }
}
