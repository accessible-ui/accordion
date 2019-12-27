import React, {
  cloneElement,
  useState,
  useRef,
  useMemo,
  useEffect,
  useContext,
  useCallback,
} from 'react'
import useKeycode from '@accessible/use-keycode'
import useConditionalFocus from '@accessible/use-conditional-focus'
import useMergedRef from '@react-hook/merged-ref'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useId from '@accessible/use-id'
import clsx from 'clsx'

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

export interface AccordionContextValue {
  sections: (HTMLElement | undefined)[]
  registerSection: (index: number, trigger: HTMLElement) => () => void
  active: number[]
  activate: (section: number | undefined) => void
  deactivate: (section: number | undefined) => void
  isActive: (section: number | undefined) => boolean
  allowAllClosed: boolean
}

// @ts-ignore
export const AccordionContext: React.Context<AccordionContextValue> = React.createContext(
    {}
  ),
  {Consumer: AccordionConsumer} = AccordionContext,
  useAccordion = () => useContext<AccordionContextValue>(AccordionContext)

export interface AccordionProps {
  active?: number | number[]
  defaultActive?: number | number[]
  allowMultipleOpen?: boolean
  allowAllClosed?: boolean
  onChange?: (active: number | number[]) => void
  children:
    | React.ReactElement
    | React.ReactElement[]
    | JSX.Element
    | JSX.Element[]
}

export const Accordion: React.FC<AccordionProps> = ({
  active,
  defaultActive,
  allowMultipleOpen = false,
  allowAllClosed = false,
  onChange,
  children,
}) => {
  const [sections, setSections] = useState<(HTMLElement | undefined)[]>([])
  const [userActive, setActive] = useState<number[]>(
    Array.isArray(defaultActive)
      ? defaultActive
      : typeof defaultActive === 'number'
      ? [defaultActive]
      : []
  )

  const nextActive =
    typeof active === 'undefined'
      ? userActive
      : Array.isArray(active)
      ? active
      : [active]

  if (__DEV__) {
    if (!allowAllClosed && nextActive.length === 0) {
      throw new Error(
        `Accordion requires at least one section to be open, but there were no active sections.`
      )
    }

    React.Children.forEach(children, child => {
      if (
        (typeof child !== 'object' && child === null) ||
        (child as React.ReactElement).type !== Section
      ) {
        throw new Error(
          `Accordion requires that all of its direct children be Section components.`
        )
      }
    })
  }

  const context = useMemo(
    () => ({
      sections,
      registerSection: (index: number, trigger: HTMLElement) => {
        setSections(current => {
          const next = current.slice(0)
          next[index] = trigger
          return next
        })

        return () =>
          setSections(current => {
            if (current[index] === void 0) return current
            const next = current.slice(0)
            next[index] = void 0
            return next
          })
      },
      active: nextActive,
      activate: (index: number | undefined) =>
        setActive(current => {
          if (index === void 0 || current.indexOf(index) > -1) return current
          if (allowMultipleOpen) return current.concat(index)
          return [index]
        }),
      deactivate: (index: number | undefined) =>
        setActive(current => {
          if (index === void 0 || current.indexOf(index) === -1) return current
          if (current.length === 1 && !allowAllClosed) return current
          return current
            .slice(0, current.indexOf(index))
            .concat(current.slice(current.indexOf(index) + 1))
        }),
      isActive: (index: number | undefined) =>
        index !== void 0 && nextActive.indexOf(index) > -1,
      allowAllClosed,
    }),
    [sections, nextActive, allowMultipleOpen, allowAllClosed]
  )

  useEffect(() => {
    onChange?.(allowMultipleOpen ? nextActive : nextActive[0])
  }, [nextActive])

  return (
    <AccordionContext.Provider value={context}>
      {React.Children.map(children, (child_, index) => {
        const child = child_ as React.ReactElement
        const {index: childIndex} = child.props

        return cloneElement(child, {
          key: child.key === null ? index : child.key,
          index: childIndex !== void 0 ? childIndex : index,
        })
      })}
    </AccordionContext.Provider>
  )
}

export interface SectionContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id?: string
  index: number
  triggerRef: React.MutableRefObject<HTMLElement | null>
}

export interface SectionControls {
  open: () => void
  close: () => void
  toggle: () => void
}

// @ts-ignore
export const SectionContext: React.Context<SectionContextValue> = React.createContext(
    {}
  ),
  {Consumer: SectionConsumer} = SectionContext,
  useSection = () => useContext<SectionContextValue>(SectionContext),
  useIsOpen = () => useSection().isOpen,
  useControls = (): SectionControls => {
    const {open, close, toggle} = useSection()
    return {open, close, toggle}
  }

export interface SectionProps {
  id?: string
  index?: number
  children:
    | React.ReactNode
    | React.ReactNode[]
    | JSX.Element[]
    | JSX.Element
    | ((context: SectionContextValue) => React.ReactNode)
}

export const Section: React.FC<SectionProps> = ({id, index, children}) => {
  const {isActive, activate, deactivate, registerSection} = useAccordion()
  const triggerRef = useRef<HTMLElement>(null)
  id = useId(id)

  useEffect(
    () => registerSection(index as number, triggerRef.current as HTMLElement),
    []
  )

  const context = useMemo(
    () => ({
      id,
      index: index as number,
      open: () => activate(index),
      close: () => deactivate(index),
      toggle: () => (isActive(index) ? deactivate(index) : activate(index)),
      isOpen: isActive(index),
      triggerRef,
    }),
    [id, index, activate, deactivate, isActive]
  )

  return (
    <SectionContext.Provider
      value={context}
      // @ts-ignore
      children={typeof children === 'function' ? children(context) : children}
    />
  )
}

export interface TriggerProps {
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}

export const Trigger: React.FC<TriggerProps> = ({
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  children,
}) => {
  const {sections, active, allowAllClosed} = useAccordion()
  const {isOpen, id, index, toggle, triggerRef} = useSection()
  const clicked = useRef(false)
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    triggerRef,
    // space bar
    useKeycode(32, e => {
      // prevents click event from firing if the trigger is a button
      e?.preventDefault()
      toggle()
    }),
    // enter
    useKeycode(13, () => {
      // prevents enter event from firing if the trigger is a button
      if (!clicked.current) toggle()
      clicked.current = false
    }),
    // down arrow
    useKeycode(40, () => focusNext(sections, index)),
    // up arrow
    useKeycode(38, () => focusPrev(sections, index)),
    // home
    useKeycode(36, () => sections[0]?.focus()),
    // end
    useKeycode(35, () => sections[sections.length - 1]?.focus())
  )

  useLayoutEffect(() => {
    // this bit of weirdness is here because someone could feasibly use a
    // <button> as an accordion trigger which causes all sorts of keyboard
    // nav issues (enter firing twice, space firing twice)
    const current = triggerRef.current
    if (current) {
      const handleKeydown = () => (clicked.current = false)
      current.addEventListener('keydown', handleKeydown)
      return () => current.removeEventListener('keydown', handleKeydown)
    }
  }, [triggerRef.current])

  return cloneElement(children, {
    'aria-controls': id,
    'aria-expanded': String(isOpen),
    'aria-disabled': String(!allowAllClosed && isOpen && active.length === 1),
    className:
      clsx(children.props.className, isOpen ? openClass : closedClass) ||
      void 0,
    style: Object.assign(
      {},
      children.props.style,
      isOpen ? openStyle : closedStyle
    ),
    tabIndex: children.props.tabIndex !== void 0 ? children.props.tabIndex : 0,
    onClick: useCallback(
      e => {
        toggle()
        clicked.current = true
        children.props.onClick?.(e)
      },
      [toggle, children.props.onClick]
    ),
    ref,
  })
}

export const focusNext = (
  sections: (HTMLElement | undefined)[],
  currentIndex: number
) => {
  if (currentIndex === sections.length - 1) sections[0]?.focus()
  else sections[currentIndex + 1]?.focus()
}

export const focusPrev = (
  sections: (HTMLElement | undefined)[],
  currentIndex: number
) => {
  if (currentIndex === 0) sections[sections.length - 1]?.focus()
  else sections[currentIndex - 1]?.focus()
}

export interface PanelProps {
  closeOnEscape?: boolean
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: React.ReactElement
}

export const Panel: React.FC<PanelProps> = ({
  closeOnEscape = true,
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  children,
}) => {
  const {id, isOpen, close, triggerRef} = useSection()
  // handles closing the modal when the ESC key is pressed
  const prevOpen = useRef<boolean>(isOpen)
  const focusRef = useConditionalFocus(!prevOpen.current && isOpen, true)
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    focusRef,
    useKeycode(27, () => {
      if (closeOnEscape) {
        close()
        triggerRef.current?.focus()
      }
    })
  )
  // ensures the accordion content won't be granted the window's focus
  // by default
  useLayoutEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  return cloneElement(children, {
    id,
    className:
      clsx(children.props.className, isOpen ? openClass : closedClass) ||
      void 0,
    style: Object.assign(
      {visibility: isOpen ? 'visible' : 'hidden'},
      children.props.style,
      isOpen ? openStyle : closedStyle
    ),
    'aria-hidden': `${!isOpen}`,
    ref,
  })
}

export interface CloseProps {
  children: JSX.Element | React.ReactElement
}

export const Close: React.FC<CloseProps> = ({children}) => {
  const {allowAllClosed, active} = useAccordion()
  const {close, isOpen, id} = useSection()

  return cloneElement(children, {
    'aria-controls': id,
    'aria-expanded': String(isOpen),
    'aria-label': children.props['aria-label'] || 'Close section',
    'aria-disabled': String(!allowAllClosed && isOpen && active.length === 1),
    onClick: useCallback(
      e => {
        close()
        children.props.onClick?.(e)
      },
      [close, children.props.onClick]
    ),
  })
}

/* istanbul ignore next */
if (__DEV__) {
  Accordion.displayName = 'Accordion'
  Section.displayName = 'Section'
  Panel.displayName = 'Panel'
  Trigger.displayName = 'Trigger'
  Close.displayName = 'Close'
}
