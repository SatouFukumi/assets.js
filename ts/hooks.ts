import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useMemo,
    Dispatch,
    SetStateAction,
    RefObject,
    useReducer,
} from "react"

import RecordAnimationFrame from "./record-animation-frame"

export const useRenderEffect: (
    effect: React.EffectCallback,
    deps?: React.DependencyList | undefined
) => void = typeof document === "undefined" ? useEffect : useLayoutEffect

export function useToggle(initial: boolean = false) {
    const [value, setValue] = useState(initial)

    function toggleValue(v?: boolean) {
        setValue((currVal) => (typeof v === "boolean" ? value : !currVal))
    }

    return [value, toggleValue] as const
}

export function useTimeout(callback: (args: any) => any, ms: number) {
    const cb = useCallback(callback, [callback])
    const timeoutIdRef = useRef<NodeJS.Timeout>()

    useRenderEffect(() => {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = setTimeout(cb, ms)

        return () => clearTimeout(timeoutIdRef.current)
    }, [ms, callback])

    function clear() {
        clearTimeout(timeoutIdRef.current)
        return { reset, clear } as const
    }

    function reset() {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = setTimeout(cb, ms)
    }

    return { reset, clear } as const
}

export function useInterval(callback: (args: any) => any, ms: number) {
    const [playing, setPlaying] = useState(true)
    const cb = useCallback(callback, [callback])
    const intervalIdRef = useRef<NodeJS.Timer>()

    useRenderEffect(() => {
        if (playing) {
            clearInterval(intervalIdRef.current)
            intervalIdRef.current = setInterval(cb, ms)
        } else {
            clearInterval(intervalIdRef.current)
        }

        return () => clearInterval(intervalIdRef.current)
    }, [callback, ms, playing])

    function stop() {
        if (!playing) return { start, stop } as const

        setPlaying(false)

        return { start, stop } as const
    }

    function start() {
        if (playing) return

        setPlaying(true)
    }

    return { start, stop } as const
}

export function useStep(maxStep: number): [number, Fukumi.StepController] {
    const [currentStep, setCurrentStep] = useState(1)

    const canGoToNextStep = useMemo(
        () => currentStep + 1 <= maxStep,

        [currentStep, maxStep]
    )

    const canGoToPrevStep = useMemo(() => currentStep - 1 >= 1, [currentStep])

    const setStep = useCallback<Fukumi.SetStepCallback>(
        (step) => {
            // Allow value to be a function so we have the same API as useState
            const newStep = step instanceof Function ? step(currentStep) : step

            if (newStep >= 1 && newStep <= maxStep) {
                setCurrentStep(newStep)

                return
            }

            throw new Error("Step not valid")
        },

        [maxStep, currentStep]
    )

    const goToNextStep = useCallback(() => {
        if (canGoToNextStep) {
            setCurrentStep((step) => step + 1)
        }
    }, [canGoToNextStep])

    const goToPrevStep = useCallback(() => {
        if (canGoToPrevStep) {
            setCurrentStep((step) => step - 1)
        }
    }, [canGoToPrevStep])

    const reset = useCallback(() => {
        setCurrentStep(1)
    }, [])

    return [
        currentStep,
        {
            goToNextStep,
            goToPrevStep,
            canGoToNextStep,
            canGoToPrevStep,
            setStep,
            reset,
        },
    ]
}

export function useRequestAnimationFrame(callback: (args: any) => any) {
    const record = useMemo(() => new RecordAnimationFrame(callback), [callback])

    return {
        start: record.start.bind(record),
        stop: record.stop.bind(record),
    }
}

// MediaQueryList Event based useEventListener interface
export function useEventListener<K extends keyof MediaQueryListEventMap>(
    eventName: K,
    handler: (event: MediaQueryListEventMap[K]) => void,
    element: RefObject<MediaQueryList>,
    options?: boolean | AddEventListenerOptions
): void
// Window Event based useEventListener interface
export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element?: undefined,
    options?: boolean | AddEventListenerOptions
): void
// Element Event based useEventListener interface
export function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement
>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    element: RefObject<T>,
    options?: boolean | AddEventListenerOptions
): void
// Document Event based useEventListener interface
export function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    element: RefObject<Document>,
    options?: boolean | AddEventListenerOptions
): void
export function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    KM extends keyof MediaQueryListEventMap,
    T extends HTMLElement | MediaQueryList | void = void
>(
    eventName: KW | KH | KM,
    handler: (
        event:
            | WindowEventMap[KW]
            | HTMLElementEventMap[KH]
            | MediaQueryListEventMap[KM]
            | Event
    ) => void,
    element?: RefObject<T>,
    options?: boolean | AddEventListenerOptions
) {
    // Create a ref that stores handler
    const savedHandler = useRef(handler)

    useRenderEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current ?? window

        if (!(targetElement && targetElement.addEventListener)) return

        // Create event listener that calls handler function stored in ref
        const listener: typeof handler = (event) => savedHandler.current(event)

        targetElement.addEventListener(eventName, listener, options)

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, listener, options)
        }
    }, [eventName, element, options])
}

export function useResizeObserver({
    ref,
    onResize,
}: {
    ref: RefObject<HTMLElement>
    onResize?: (entry: ResizeObserverEntry) => void
}): Fukumi.Size {
    const [size, setSize] = useState<Readonly<Fukumi.Size>>({
        width: 0,
        height: 0,
    })

    useRenderEffect(() => {
        if (!ref.current) return

        const obs = new ResizeObserver(([entry]) => {
            setSize({
                width: entry.borderBoxSize[0].inlineSize,
                height: entry.borderBoxSize[0].blockSize,
            })

            onResize?.(entry)
        })
        obs.observe(ref.current)

        return obs.disconnect.bind(obs)
    }, [ref, setSize])

    return size
}

export function useFetch<T = unknown>(
    url?: string,
    options?: RequestInit
): Fukumi.State<T> {
    const cache = useRef<Fukumi.Cache<T>>({})

    // Used to prevent state update if the component is unmounted
    const cancelRequest = useRef<boolean>(false)
    const initialState: Fukumi.State<T> = {}

    // Keep state logic separated
    const fetchReducer = (
        state: Fukumi.State<T>,
        action: Fukumi.Action<T>
    ): Fukumi.State<T> => {
        switch (action.type) {
            case "loading":
                return { ...initialState }

            case "fetched":
                return { ...initialState, data: action.payload }

            case "error":
                return { ...initialState, error: action.payload }

            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(fetchReducer, initialState)

    useEffect(() => {
        // Do nothing if the url is not given
        if (!url) return

        cancelRequest.current = false

        const fetchData = async () => {
            dispatch({ type: "loading" })

            // If a cache exists for this url, return it
            if (cache.current[url]) {
                dispatch({ type: "fetched", payload: cache.current[url] })

                return
            }

            try {
                const response = await fetch(url, options)

                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                const data = (await response.json()) as T
                cache.current[url] = data

                if (cancelRequest.current) return

                dispatch({ type: "fetched", payload: data })
            } catch (error) {
                if (cancelRequest.current) return

                dispatch({ type: "error", payload: error as Error })
            }
        }

        void fetchData()

        // Use the cleanup function for avoiding a possibly...
        // ...state update after the component was unmounted
        return () => {
            cancelRequest.current = true
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    return state
}

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

export function useArray<T extends any>(initialArr: T[]) {
    const [array, setArray] = useState(initialArr)

    function push(element: T) {
        setArray((a) => [...a, element])
    }

    function filter(
        callback: (element: T, index: number, array: T[]) => unknown,
        thisArg?: any
    ) {
        setArray((a) => a.filter(callback, thisArg))
    }

    function update(index: number, newElement: T) {
        setArray((a) => [
            ...a.slice(0, index),
            newElement,
            ...a.slice(index + 1, a.length),
        ])
    }

    function remove(index: number) {
        setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)])
    }

    function clear() {
        setArray([])
    }

    return { array, set: setArray, push, filter, update, remove, clear }
}

declare global {
    namespace Fukumi {
        interface Size {
            width: number
            height: number
        }

        interface StepController {
            goToNextStep: () => void
            goToPrevStep: () => void
            reset: () => void
            canGoToNextStep: boolean
            canGoToPrevStep: boolean
            setStep: Dispatch<SetStateAction<number>>
        }

        type SetStepCallback = (step: number | ((step: number) => number)) => void

        interface State<T> {
            data?: T

            error?: Error
        }

        type Cache<T> = { [url: string]: T }

        // discriminated union type
        type Action<T> =
            | { type: "loading" }
            | { type: "fetched"; payload: T }
            | { type: "error"; payload: Error }
    }
}
