import { useEffect, useLayoutEffect } from "react"

export const useRenderEffect: (
    effect: React.EffectCallback,
    deps?: React.DependencyList | undefined
) => void = typeof document === "undefined" ? useEffect : useLayoutEffect
