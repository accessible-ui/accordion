import * as React from 'react'
export interface AccordionContextValue {
  sections: (HTMLElement | undefined)[]
  registerSection: (index: number, trigger: HTMLElement) => () => void
  opened: number[]
  open: (section: number | undefined) => void
  close: (section: number | undefined) => void
  isOpen: (section: number | undefined) => boolean
  allowAllClosed: boolean
}
export declare const AccordionContext: React.Context<AccordionContextValue>,
  AccordionConsumer: React.Consumer<AccordionContextValue>,
  useAccordion: () => AccordionContextValue
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
export declare const Accordion: React.FC<AccordionProps>
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
export declare const SectionContext: React.Context<SectionContextValue>,
  SectionConsumer: React.Consumer<SectionContextValue>,
  useSection: () => SectionContextValue,
  useIsOpen: () => boolean,
  useDisabled: () => boolean,
  useControls: () => SectionControls
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
export declare const Section: React.FC<SectionProps>
export interface TriggerProps {
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}
export declare const Trigger: React.FC<TriggerProps>
export interface PanelProps {
  closeOnEscape?: boolean
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: React.ReactElement
}
export declare const Panel: React.FC<PanelProps>
export interface CloseProps {
  children: JSX.Element | React.ReactElement
}
export declare const Close: React.FC<CloseProps>
