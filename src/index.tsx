import React, {
  cloneElement,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react'
import {useKeycodes} from '@accessible/use-keycode'
import useConditionalFocus from '@accessible/use-conditional-focus'
import useId from '@accessible/use-id'
import Button from '@accessible/button'
import useMergedRef from '@react-hook/merged-ref'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import clsx from 'clsx'

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

export interface AccordionContextValue {
  sections: (HTMLElement | undefined)[]
  registerSection: (index: number, trigger: HTMLElement) => () => void
  opened: number[]
  open: (section: number | undefined) => void
  close: (section: number | undefined) => void
  isOpen: (section: number | undefined) => boolean
  allowAllClosed: boolean
}

// @ts-ignore
export const AccordionContext: React.Context<AccordionContextValue> = React.createContext(
    {}
  ),
  {Consumer: AccordionConsumer} = AccordionContext,
  useAccordion = () => useContext<AccordionContextValue>(AccordionContext)

export interface AccordionProps {
  open?: number | number[]
  defaultOpen?: number | number[]
  allowMultipleOpen?: boolean
  allowAllClosed?: boolean
  onChange?: (opened: number | number[]) => void
  children:
    | React.ReactElement
    | React.ReactElement[]
    | JSX.Element
    | JSX.Element[]
}

export const Accordion: React.FC<AccordionProps> = ({
  open,
  defaultOpen,
  allowMultipleOpen = false,
  allowAllClosed = false,
  onChange,
  children,
}) => {
  const [sections, setSections] = useState<(HTMLElement | undefined)[]>([])
  const [openState, setOpen] = useState<number[]>(
    Array.isArray(defaultOpen)
      ? defaultOpen
      : typeof defaultOpen === 'number'
      ? [defaultOpen]
      : []
  )
  const nextOpen = useMemo(
    () =>
      typeof open === 'undefined'
        ? openState
        : Array.isArray(open)
        ? open
        : [open],
    [open, openState]
  )
  const prevOpen = useRef<number[]>(nextOpen)

  if (__DEV__) {
    React.Children.forEach(children, child => {
      if (
        (typeof child !== 'object' && child !== null) ||
        (child as React.ReactElement).type !== Section
      ) {
        throw new Error(
          `Accordion requires that all of its direct children be Section components.`
        )
      }
    })

    if (!allowMultipleOpen && nextOpen.length > 1) {
      throw new Error(
        `You must enable 'allowMultipleOpen' in order to open multiple sections at once.`
      )
    }

    if (!allowAllClosed && nextOpen.length === 0) {
      throw new Error(
        `Accordion requires at least one section to be open, but there were no opened sections.`
      )
    }
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
      opened: nextOpen,
      open: (index: number | undefined) =>
        setOpen(current => {
          if (index === void 0 || current.indexOf(index) > -1) return current
          if (allowMultipleOpen) return current.concat(index)
          return [index]
        }),
      close: (index: number | undefined) =>
        setOpen(current => {
          if (index === void 0 || current.indexOf(index) === -1) return current
          if (current.length === 1 && !allowAllClosed) return current
          return current
            .slice(0, current.indexOf(index))
            .concat(current.slice(current.indexOf(index) + 1))
        }),
      isOpen: (index: number | undefined) =>
        index !== void 0 && nextOpen.indexOf(index) > -1,
      allowAllClosed,
    }),
    [sections, nextOpen, allowMultipleOpen, allowAllClosed]
  )

  useEffect(() => {
    prevOpen.current !== nextOpen &&
      onChange?.(allowMultipleOpen ? nextOpen : nextOpen[0])
    prevOpen.current = nextOpen
  }, [nextOpen])

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
  disabled: boolean
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
  useDisabled = () => useSection().disabled,
  useControls = (): SectionControls => {
    const {open, close, toggle} = useSection()
    return {open, close, toggle}
  }

export interface SectionProps {
  id?: string
  index?: number
  disabled?: boolean
  children:
    | React.ReactNode
    | React.ReactNode[]
    | JSX.Element[]
    | JSX.Element
    | ((context: SectionContextValue) => React.ReactNode)
}

export const Section: React.FC<SectionProps> = ({
  id,
  index,
  disabled = false,
  children,
}) => {
  const {isOpen, open, close, registerSection} = useAccordion()
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
      open: () => {
        !disabled && open(index)
      },
      close: () => {
        !disabled && close(index)
      },
      toggle: () => {
        !disabled && (isOpen(index) ? close(index) : open(index))
      },
      isOpen: isOpen(index),
      disabled,
      triggerRef,
    }),
    [id, index, open, close, isOpen, disabled]
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
  const {sections, opened, allowAllClosed} = useAccordion()
  const {isOpen, id, index, toggle, disabled, triggerRef} = useSection()
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    triggerRef,
    useKeycodes(
      {
        // down arrow
        40: () => focusNext(sections, index),
        // up arrow
        38: () => focusPrev(sections, index),
        // home
        36: () => sections[0]?.focus(),
        // end
        35: () => sections[sections.length - 1]?.focus(),
      },
      [sections, index]
    )
  )

  return (
    <Button>
      {cloneElement(children, {
        'aria-controls': id,
        'aria-expanded': '' + isOpen,
        'aria-disabled':
          '' + (disabled || (!allowAllClosed && isOpen && opened.length === 1)),
        tabIndex: disabled ? -1 : 0,
        className:
          clsx(children.props.className, isOpen ? openClass : closedClass) ||
          void 0,
        style: Object.assign(
          {},
          children.props.style,
          isOpen ? openStyle : closedStyle
        ),
        onClick: children.props.onClick
          ? useCallback(
              e => {
                toggle()
                children.props.onClick(e)
              },
              [toggle, children.props.onClick]
            )
          : toggle,
        ref,
      })}
    </Button>
  )
}

const focusNext = (
  sections: (HTMLElement | undefined)[],
  currentIndex: number
) => {
  if (currentIndex === sections.length - 1) sections[0]?.focus()
  else sections[currentIndex + 1]?.focus()
}

const focusPrev = (
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
    useKeycodes(
      {
        27: () => {
          if (closeOnEscape) {
            close()
            triggerRef.current?.focus()
          }
        },
      },
      [closeOnEscape, close, triggerRef.current]
    )
  )
  // ensures the accordion content won't be granted the window's focus
  // by default
  useLayoutEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  return cloneElement(children, {
    'aria-hidden': `${!isOpen}`,
    id,
    className:
      clsx(children.props.className, isOpen ? openClass : closedClass) ||
      void 0,
    style: Object.assign(
      {visibility: isOpen ? 'visible' : 'hidden'},
      children.props.style,
      isOpen ? openStyle : closedStyle
    ),
    ref,
  })
}

export interface CloseProps {
  children: JSX.Element | React.ReactElement
}

export const Close: React.FC<CloseProps> = ({children}) => {
  const {allowAllClosed, opened} = useAccordion()
  const {close, isOpen, id} = useSection()
  return (
    <Button>
      {cloneElement(children, {
        'aria-controls': id,
        'aria-expanded': '' + isOpen,
        'aria-label': children.props['aria-label'] || 'Close section',
        'aria-disabled': '' + !allowAllClosed && isOpen && opened.length === 1,
        onClick:
          typeof children.props.onClick === 'function'
            ? useCallback(
                e => {
                  close()
                  children.props.onClick(e)
                },
                [close, children.props.onClick]
              )
            : close,
      })}
    </Button>
  )
}

/* istanbul ignore next */
if (__DEV__) {
  Accordion.displayName = 'Accordion'
  Section.displayName = 'Section'
  Panel.displayName = 'Panel'
  Trigger.displayName = 'Trigger'
  Close.displayName = 'Close'
}
