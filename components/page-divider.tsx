import type { Property } from "csstype"

import {
    Children,
    useMemo,
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    ReactElement,
    MouseEventHandler,
    useLayoutEffect,
} from "react"
import classNames from "classnames"

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
    children,
    sections,
}: Fukumi.DividerProps): JSX.Element {
    const [currentSection, setCurrentSection] = useState(sections[0].name)

    const bodySections: Fukumi.SectionElement[] = useMemo(
        (): JSX.Element[] =>
            children.filter((child: JSX.Element): boolean => child.type === Section),
        [children]
    )

    const buttons: Fukumi.ButtonElement[] = useMemo(
        (): JSX.Element[] =>
            children.filter((child: JSX.Element): boolean => child.type === Button),
        [children]
    )

    return (
        <div className={styles.container}>
            <div
                className={styles.wrapper}
                style={{ maxWidth: maxWidth ?? "1200px" }}
            >
                <DividerHead
                    sections={sections}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                >
                    {buttons}
                </DividerHead>

                <DividerBody currentSection={currentSection}>{bodySections}</DividerBody>
            </div>

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

function DividerBody({ children, currentSection }: Fukumi.DividerBodyProps): JSX.Element {
    return (
        <div className={styles.body}>
            <ScrollBox>
                <div data-role="wrapper">
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
                </div>
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
    const [currentSectionIcon, setCurrentSectionIcon] = useState(sections[0].icon)
    const [currentSectionDescription, setCurrentSectionDescription] = useState(
        sections[0].description ?? "\u2800"
    )

    useLayoutEffect((): void => {
        const targetedSection: Fukumi.DividerSection | undefined = sections.find(
            (section: Fukumi.DividerSection): boolean => section.name === currentSection
        )

        if (targetedSection === undefined) return

        setCurrentSectionIcon(targetedSection.icon)
        setCurrentSectionDescription(targetedSection.description ?? "\u2800")
    }, [sections, currentSectionDescription, currentSectionIcon])

    return (
        <div className={styles.head}>
            <Icon iconClass={currentSectionIcon} />

            <div style={{ flexGrow: 1 }}>
                <Switches
                    sections={sections}
                    currentSection={currentSection}
                    setSection={setCurrentSection}
                    setSectionDescription={setCurrentSectionDescription}
                    setSectionIcon={setCurrentSectionIcon}
                />

                <div className={styles.description}>{currentSectionDescription}</div>
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
                (section: Fukumi.DividerSection, index: number): JSX.Element => (
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
    const onClick: () => void = useCallback((): void => {
        if (currentSection === name) return

        setSection(name)
        setSectionIcon(icon)
        setSectionDescription(description ?? "\u2800")
    }, [currentSection, description, name, icon])

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

function Buttons({ children, currentSection }: Fukumi.ButtonsProps): JSX.Element {
    return (
        <div className={styles.buttons}>
            {Children.map(
                children,
                (Child: Fukumi.ButtonElement, index: number): JSX.Element | boolean =>
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
    icon,
    text,
    glasiumOptions = {},
}: Fukumi.ButtonProps): JSX.Element {
    let iconClass = icon ?? "nfb nf-cod-code"

    return (
        <button
            className={classNames({
                [glasiumStyles.button]: true,
                [styles.button]: true,
            })}
            onClick={onClick}
        >
            <Glasium {...glasiumOptions} />
            <i
                className={classNames({
                    [iconClass]: true,
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
            sections: DividerSection[]
            children: JSX.Element[]
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
            extends Omit<SwitchProps, "name" | "title" | "description" | "icon"> {
            sections: DividerSection[]
        }

        interface ButtonProps {
            text?: string
            icon?: string
            glasiumOptions?: Fukumi.GlasiumProps
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
            children: React.ReactNode
        }

        type SectionElement = ReactElement<SectionProps>

        interface DividerBodyProps {
            children: SectionElement[]
            currentSection: string
        }
    }
}
