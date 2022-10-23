export * from './use-array'
export * from './use-async'
export * from './use-clock'
export * from './use-counter'
export * from './use-event-listener'
export * from './use-fetch'
export * from './use-interval'
export * from './use-observer'
export * from './use-render-effect'
export * from './use-request-animation-frame'
export * from './use-step'
export * from './use-storage'
export * from './use-theme'
export * from './use-timeout'
export * from './use-toggle'
export * from './use-unfocus'

// TODO : useTranslation
// TODO : useCookie

declare global {
    namespace Fukumi {
        type SetState<T> = React.Dispatch<React.SetStateAction<T>>
    }
}
