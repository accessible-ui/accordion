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
  panels: (HTMLElement | undefined)[]
  registerPanel: (index: number, trigger: HTMLElement) => () => void
  activate: (panel: number | undefined) => void
  deactivate: (panel: number | undefined) => void
  isActive: (panel: number | undefined) => boolean
}

// @ts-ignore
export const AccordionContext: React.Context<AccordionContextValue> = React.createContext({}),
  {Consumer: AccordionConsumer} = AccordionContext,
  useAccordion = () => useContext<AccordionContextValue>(AccordionContext)

export interface AccordionProps {
  active?: number | number[]
  defaultActive?: number | number[]
  allowMultipleOpen?: boolean
  allowAllClosed?: boolean
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
  children,
}) => {
  const [panels, setPanels] = useState<(HTMLElement | undefined)[]>([])
  const [userActive, setActive] = useState<number[]>(
    Array.isArray(defaultActive)
      ? defaultActive
      : typeof defaultActive === 'number'
      ? [defaultActive]
      : []
  )

  const currentActive =
    typeof active === 'undefined'
      ? userActive
      : Array.isArray(active)
      ? active
      : [active]

  if (__DEV__) {
    if (!allowAllClosed && currentActive.length === 0) {
      throw new Error(
        `Accordion requires at least one panel to be open, but there were no active panels.`
      )
    }

    React.Children.forEach(children, child => {
      if (
        (typeof child !== 'object' && child === null) ||
        (child as React.ReactElement).type !== Panel
      ) {
        throw new Error(
          `Accordion requires that all of its direct children be Panel components.`
        )
      }
    })
  }

  const context = useMemo(
    () => ({
      panels,
      registerPanel: (index: number, trigger: HTMLElement) => {
        setPanels(current => {
          const next = current.slice(0)
          next[index] = trigger
          return next
        })

        return () =>
          setPanels(current => {
            if (current[index] === void 0) return current
            const next = current.slice(0)
            next[index] = void 0
            return next
          })
      },
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
        index !== void 0 && currentActive.indexOf(index) > -1,
    }),
    [panels, currentActive, allowMultipleOpen, allowAllClosed]
  )

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

export interface PanelContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id: string
  index: number
  triggerRef: React.MutableRefObject<HTMLElement | null>
}

export interface PanelControls {
  open: () => void
  close: () => void
  toggle: () => void
}

// @ts-ignore
export const PanelContext: React.Context<PanelContextValue> = React.createContext({}),
  {Consumer: PanelConsumer} = PanelContext,
  usePanel = () => useContext<PanelContextValue>(PanelContext),
  useIsOpen = () => usePanel().isOpen,
  useControls = (): PanelControls => {
    const {open, close, toggle} = usePanel()
    return {open, close, toggle}
  }

export interface TargetProps {
  closeOnEscape?: boolean
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: React.ReactElement
}

export const Target: React.FC<TargetProps> = ({
  closeOnEscape = true,
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  children,
}) => {
  const {id, isOpen, close, triggerRef} = usePanel()
  // handles closing the modal when the ESC key is pressed
  const focusRef = useConditionalFocus(isOpen, true)
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
  const {close, isOpen, id} = usePanel()

  return cloneElement(children, {
    'aria-controls': id,
    'aria-expanded': String(isOpen),
    'aria-label': children.props['aria-label'] || 'Close panel',
    onClick: useCallback(
      e => {
        close()
        children.props.onClick?.(e)
      },
      [close, children.props.onClick]
    ),
  })
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
  const {isOpen, id, index, toggle, triggerRef} = usePanel()
  const clicked = useRef(false)
  const {panels} = useAccordion()
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
    useKeycode(40, () => focusNext(panels, index)),
    // up arrow
    useKeycode(38, () => focusPrev(panels, index)),
    // home
    useKeycode(36, () => panels[0]?.focus()),
    // end
    useKeycode(35, () => panels[panels.length - 1]?.focus())
  )

  useLayoutEffect(() => {
    // this bit of weirdness is here because someone could feasibly use a
    // <button> as an accordion trigger which causes all sorts of keyboard
    // nav issues (enter firing twice, space firing twice)
    const current = triggerRef.current
    if (current) {
      const handleKeydown = () => clicked.current = false
      current.addEventListener('keydown', handleKeydown)
      return () => current.removeEventListener('keydown', handleKeydown)
    }
  }, [triggerRef.current])

  return cloneElement(children, {
    'aria-controls': id,
    'aria-expanded': String(isOpen),
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
  panels: (HTMLElement | undefined)[],
  currentIndex: number
) => {
  if (currentIndex === panels.length - 1) panels[0]?.focus()
  else panels[currentIndex + 1]?.focus()
}

export const focusPrev = (
  panels: (HTMLElement | undefined)[],
  currentIndex: number
) => {
  if (currentIndex === 0) panels[panels.length - 1]?.focus()
  else panels[currentIndex - 1]?.focus()
}

export interface PanelProps {
  id?: string
  index?: number
  children:
    | React.ReactNode
    | React.ReactNode[]
    | JSX.Element[]
    | JSX.Element
    | ((context: PanelContextValue) => React.ReactNode)
}

export const Panel: React.FC<PanelProps> = ({id, index, children}) => {
  const {isActive, activate, deactivate, registerPanel} = useAccordion()
  const triggerRef = useRef<HTMLElement>(null)
  const realId = `collapse--${useId(id)}`

  useEffect(
    () => registerPanel(index as number, triggerRef.current as HTMLElement),
    []
  )

  const context = useMemo(
    () => ({
      id: realId,
      index: index as number,
      open: () => activate(index),
      close: () => deactivate(index),
      toggle: () => (isActive(index) ? deactivate(index) : activate(index)),
      isOpen: isActive(index),
      triggerRef,
    }),
    [realId, index, activate, deactivate, isActive]
  )

  return (
    <PanelContext.Provider
      value={context}
      // @ts-ignore
      children={typeof children === 'function' ? children(context) : children}
    />
  )
}

/* istanbul ignore next */
if (__DEV__) {
  Accordion.displayName = 'Accordion'
  Panel.displayName = 'Panel'
  Target.displayName = 'Target'
  Trigger.displayName = 'Trigger'
  Close.displayName = 'Close'
}
