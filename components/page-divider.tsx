import type { Property } from "csstype"

import {
    Children,
    useMemo,
    useState,
    Dispatch,
    SetStateAction,
    ReactElement,
    MouseEventHandler,
    CSSProperties,
} from "react"
import classNames from "classnames"

import { useRenderEffect } from "@ts/libraries"
import Glasium from "./glasium"
import ScrollBox from "./scroll-box"

/** stylesheet */
import styles from "@styles/components/page-divider.module.scss"
import glasiumStyles from "@styles/components/glasium.module.scss"

function Icon({ iconClass }: { iconClass: string }): JSX.Element {
    return (
        <div className={styles.icon}>
            <i className={iconClass} />
        </div>
    )
}

export function Divider({
    maxWidth,
    backgroundOuterVar,
    backgroundInnerVar,
    children,
    sections = [],
}: Fukumi.DividerProps): JSX.Element {
    const children_: JSX.Element[] = useMemo(
        (): JSX.Element[] =>
            children instanceof Array ? children : [children],
        [children]
    )

    const [currentSection, setCurrentSection] =
        useState<Fukumi.DividerSection["name"]>("")

    useRenderEffect((): void => {
        if (sections.length) setCurrentSection(sections[0].name)
    }, [sections])

    const bgOuterVar: string = backgroundOuterVar ?? "--undefined"
    const bgInnerVar: string = backgroundInnerVar ?? "--undefined"

    const bodySections: Fukumi.SectionElement[] = useMemo(
        (): JSX.Element[] =>
            children_.filter(
                (child: JSX.Element): boolean => child.type === Section
            ),
        [children_]
    )

    const buttons: Fukumi.ButtonElement[] = useMemo(
        (): JSX.Element[] =>
            children_.filter(
                (child: JSX.Element): boolean => child.type === Button
            ),
        [children_]
    )

    if (!sections.length)
        return (
            <div
                className={styles.container}
                style={{ background: `var(${bgOuterVar}, transparent)` }}
            >
                <div
                    className={styles.wrapper}
                    style={
                        {
                            maxWidth: maxWidth ?? "1200px",
                            background: `var(${bgInnerVar}, var(--global-background-color))`,
                            "--box-shadow-color-var": !backgroundOuterVar
                                ? "--undefined"
                                : "var(--box-shadow-color)",
                        } as CSSProperties
                    }
                >
                    <div className={styles.body}>
                        <ScrollBox curve>
                            <div className={styles.section}>{children_}</div>
                        </ScrollBox>
                    </div>
                </div>
            </div>
        )

    return (
        <div
            className={styles.container}
            style={{ background: `var(${bgOuterVar}, transparent)` }}
        >
            <div
                className={styles.wrapper}
                style={
                    {
                        maxWidth: maxWidth ?? "1200px",
                        background: `var(${bgInnerVar}, var(--global-background-color))`,
                        "--box-shadow-color-var": !backgroundOuterVar
                            ? "--undefined"
                            : "var(--box-shadow-color)",
                    } as CSSProperties
                }
            >
                <DividerHead
                    sections={sections}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                >
                    {buttons}
                </DividerHead>

                <DividerBody currentSection={currentSection}>
                    {bodySections}
                </DividerBody>
            </div>

            {children_.filter(
                (child: JSX.Element): boolean =>
                    child.type !== Button &&
                    child.type !== Section &&
                    child.type !== Divider
            )}

            <style>
                {`@media (max-width: calc(${maxWidth ?? "1200px"} / 1.05)) {
                    .${styles.button} .${glasiumStyles.text} {
                        display: none;
                    }
                  }`}
            </style>
        </div>
    )
}

function DividerBody({
    children,
    currentSection,
}: Fukumi.DividerBodyProps): JSX.Element {
    return (
        <div className={styles.body}>
            <ScrollBox curve>
                <>
                    {Children.map(
                        children,
                        (
                            Child: Fukumi.SectionElement,
                            index: number
                        ): true | React.ReactNode =>
                            currentSection !== Child.props.name || (
                                <Child.type
                                    key={index}
                                    {...Child.props}
                                />
                            )
                    )}
                </>
            </ScrollBox>
        </div>
    )
}

export function Section(props: Fukumi.SectionProps): JSX.Element {
    return (
        <div
            {...props}
            className={styles.section}
        />
    )
}

function DividerHead({
    sections,
    currentSection,
    setCurrentSection,
    children,
}: Fukumi.DividerHeadProps): JSX.Element {
    const [currentSectionIcon, setCurrentSectionIcon] = useState(
        sections[0].icon
    )
    const [currentSectionDescription, setCurrentSectionDescription] = useState(
        sections[0].description ?? "\u2800"
    )

    useRenderEffect((): void => {
        const targetedSection: Fukumi.DividerSection | undefined =
            sections.find(
                (section: Fukumi.DividerSection): boolean =>
                    section.name === currentSection
            )

        if (targetedSection === undefined) return

        setCurrentSectionIcon(targetedSection.icon)
        setCurrentSectionDescription(targetedSection.description ?? "\u2800")
    }, [sections, currentSectionDescription, currentSectionIcon])

    return (
        <div className={styles.head}>
            <Icon iconClass={currentSectionIcon} />

            <div className={styles.grow}>
                <Switches
                    sections={sections}
                    currentSection={currentSection}
                    setSection={setCurrentSection}
                    setSectionDescription={setCurrentSectionDescription}
                    setSectionIcon={setCurrentSectionIcon}
                />

                <div className={styles.description}>
                    {currentSectionDescription}
                </div>
            </div>

            <Buttons currentSection={currentSection}>{children}</Buttons>
        </div>
    )
}

function Switches({
    sections,
    currentSection,
    setSection,
    setSectionDescription,
    setSectionIcon,
}: Fukumi.SwitchesProps): JSX.Element {
    return (
        <div className={styles.switches}>
            {sections.map(
                (
                    section: Fukumi.DividerSection,
                    index: number
                ): JSX.Element => (
                    <Switch
                        key={index}
                        {...section}
                        currentSection={currentSection}
                        setSection={setSection}
                        setSectionIcon={setSectionIcon}
                        setSectionDescription={setSectionDescription}
                    />
                )
            )}
        </div>
    )
}

function Switch({
    title,
    icon,
    description,
    name,
    currentSection,
    setSection,
    setSectionDescription,
    setSectionIcon,
}: Fukumi.SwitchProps): JSX.Element {
    const onClick: () => void = (): void => {
        if (currentSection === name) return

        setSection(name)
        setSectionIcon(icon)
        setSectionDescription(description ?? "\u2800")
    }

    return (
        <span
            className={styles.switch}
            onClick={onClick}
            data-activated={currentSection === name}
        >
            {title}
        </span>
    )
}

function Buttons({
    children,
    currentSection,
}: Fukumi.ButtonsProps): JSX.Element {
    return (
        <div className={styles.buttons}>
            {Children.map(
                children,
                (
                    Child: Fukumi.ButtonElement,
                    index: number
                ): JSX.Element | boolean =>
                    currentSection !== Child.props.forSection || (
                        <Child.type
                            {...Child.props}
                            key={index}
                        />
                    )
            )}
        </div>
    )
}

export function Button({
    onClick,
    icon = "nfb nf-cod-code",
    text,
    disabled = false,
    title,
    tooltipTitle,
    glasiumOptions = {},
}: Fukumi.ButtonProps): JSX.Element {
    return (
        <button
            className={classNames({
                [glasiumStyles.button]: true,
                [styles.button]: true,
            })}
            title={title}
            data-title={tooltipTitle}
            onClick={onClick}
            disabled={disabled}
        >
            <Glasium {...glasiumOptions} />
            <i
                className={classNames({
                    [icon]: true,
                    [glasiumStyles.icon]: true,
                })}
            />
            {!text || <span className={glasiumStyles.text}>{text}</span>}
        </button>
    )
}

/** global */
declare global {
    namespace Fukumi {
        interface DividerSection {
            name: string
            title: string
            description?: string
            icon: string
        }

        interface DividerProps {
            maxWidth?: Property.Width
            /**
             * @example
             * ```css
             * --background-outer
             * ```
             */
            backgroundOuterVar?: string
            /**
             * @example
             * ```css
             * --background-outer
             * ```
             */
            backgroundInnerVar?: string
            sections?: DividerSection[]
            children: JSX.Element[] | JSX.Element
        }

        interface DividerHeadProps {
            children: ButtonElement[]
            sections: DividerSection[]
            currentSection: string
            setCurrentSection: Dispatch<SetStateAction<string>>
        }

        interface SwitchProps extends DividerSection {
            currentSection: string
            setSection: Dispatch<SetStateAction<string>>
            setSectionIcon: Dispatch<SetStateAction<string>>
            setSectionDescription: Dispatch<SetStateAction<string>>
        }

        interface SwitchesProps
            extends Omit<
                SwitchProps,
                "name" | "title" | "description" | "icon"
            > {
            sections: DividerSection[]
        }

        interface ButtonProps {
            text?: string
            icon?: string
            glasiumOptions?: Fukumi.GlasiumProps
            disabled?: boolean
            title?: string
            tooltipTitle?: string
            forSection: string
            onClick: MouseEventHandler<HTMLButtonElement>
        }

        type ButtonElement = ReactElement<ButtonProps>

        interface ButtonsProps {
            children: ButtonElement[]
            currentSection: string
        }

        interface SectionProps {
            name: string
            children: React.ReactNode | React.ReactNode[]
        }

        type SectionElement = ReactElement<SectionProps>

        interface DividerBodyProps {
            children: SectionElement[]
            currentSection: string
        }
    }
}
