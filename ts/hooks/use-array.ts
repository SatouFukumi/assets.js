import { useState } from "react"

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
