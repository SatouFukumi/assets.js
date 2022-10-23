import { useState } from "react"

export function useToggle(initial: boolean = false) {
    const [value, setValue] = useState(initial)

    function toggleValue(v?: boolean) {
        setValue((currVal) => (typeof v === "boolean" ? value : !currVal))
    }

    return [value, toggleValue] as const
}
