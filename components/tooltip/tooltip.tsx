import { useRef, useEffect, memo } from "react"
import useStore from "./use-store"
import { CONSTANT, updateTooltipPosition } from "./utils"
import styles from "./tooltip.module.scss"
import Content from "./content"
import { useRequestAnimationFrame } from "@fukumi/rhooks"
import { throttled } from "@fukumi/libraries"

const Tooltip: React.FC = () => {
  type Timeout = NodeJS.Timeout | undefined
  type TimeoutRef = React.MutableRefObject<NodeJS.Timeout | undefined>
  type DivRef = React.RefObject<HTMLDivElement>

  /** store */
  const show = useStore((state) => state.show)
  const padding = useStore((state) => state.padding)
  const { width, height } = useStore((state) => state.size)
  const { activated, deactivated } = useStore((state) => state.display)
  const setPadding = useStore((state) => state.setPadding)
  const setContent = useStore((state) => state.setContent)
  const setDisplay = useStore((state) => state.setDisplay)

  /** refs */
  const containerRef: DivRef = useRef(null)

  const hideTimeoutIDRef: TimeoutRef = useRef<Timeout>()
  const deactivateTimeoutIdRef: TimeoutRef = useRef<Timeout>()

  /** this record is used to calculating position of the tooltip */
  const { start, stop } = useRequestAnimationFrame(
    throttled(() => {
      if (!containerRef.current) return

      updateTooltipPosition(containerRef.current)
    }, CONSTANT.throttle)
  )

  /** display */
  useEffect((): void | (() => void) => {
    if (show) {
      clearTimeout(deactivateTimeoutIdRef.current)
      clearTimeout(hideTimeoutIDRef.current)

      setDisplay({ activated: true, deactivated: false })

      start()
    } else {
      start()

      clearTimeout(deactivateTimeoutIdRef.current)
      clearTimeout(hideTimeoutIDRef.current)

      hideTimeoutIDRef.current = setTimeout((): void => {
        setDisplay({ activated: false, deactivated: false })

        deactivateTimeoutIdRef.current = setTimeout((): void => {
          setDisplay({ deactivated: true, activated: false })

          setContent(null)
          setPadding(true)

          stop()
        }, CONSTANT.deactivateTimeout)
      }, CONSTANT.hideTimeout)
    }

    return (): void => {
      clearTimeout(deactivateTimeoutIdRef.current)
      clearTimeout(hideTimeoutIDRef.current)

      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ width, height }}
      data-activated={activated}
      data-deactivated={deactivated}
      data-padding={padding}
    >
      <Content />
    </div>
  )
}

export default memo(Tooltip)
