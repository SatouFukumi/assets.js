import { useLocalStorage } from "./use-storage"

export function useTheme<T extends string>(themeKey: string, themeList: T[]) {
    const { value: theme, setValue: setTheme } = useLocalStorage(
        themeKey,
        themeList[0]
    )

    return { theme, setTheme }
}
