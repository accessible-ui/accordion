<hr>
<div align="center">
  <h1 align="center">
    &lt;Accordion&gt;
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=@accessible/accordion">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@accessible/accordion?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/@accessible/accordion">
    <img alt="Types" src="https://img.shields.io/npm/types/@accessible/accordion?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/accessible-ui/accordion">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/accessible-ui/accordion?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.org/accessible-ui/accordion">
    <img alt="Build status" src="https://img.shields.io/travis/accessible-ui/accordion?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@accessible/accordion">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@accessible/accordion?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@accessible/accordion?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i @accessible/accordion</pre>
<hr>

An accessible and versatile accordion for React with keyboard navigation and labeling features taught in
[w3.org's WAI-ARIA accordion best practices example](https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html).

## Features

- **Style-agnostic** You can use this component with the styling library of your choice. It
  works with CSS-in-JS, SASS, plain CSS, plain `style` objects, anything!
- **a11y/aria-compliant** This component works with screen readers out of the box and manages
  focus for you.

## Quick Start

[Check out the example on CodeSandbox](https://codesandbox.io/s/accessibleaccordion-example-7ylck)

```jsx harmony
import {Accordion, Section, Trigger, Panel} from '@accessible/accordion'

const Component = () => (
  <Accordion defaultOpen={0}>
    <Section>
      <h3>
        <Trigger>
          <button>Section 1</button>
        </Trigger>
      </h3>
      <Panel>
        <div className="panel">Section 1 content</div>
      </Panel>
    </Section>

    <Section>
      <h3>
        <Trigger>
          <button>Section 2</button>
        </Trigger>
      </h3>
      <Panel>
        <div className="panel">Section 2 content</div>
      </Panel>
    </Section>
  </Accordion>
)
```

## API

### Components

| Component                   | Description                                                                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`<Accordion>`](#accordion) | This component creates the context for your accordion section and contains some configuration options.                                                           |
| [`<Section>`](#section)     | This component creates the context for the accordion panel and trigger contained in this section. It must be a direct descendent of [`<Accordion>`](#accordion). |
| [`<Trigger>`](#trigger)     | This component clones any React element and turns it into a accordion trigger that controls the visible state of the panel.                                      |
| [`<Panel>`](#panel)         | This component clones any React element and turns it into a accordion panel.                                                                                     |
| [`<Close>`](#close)         | This is a convenience component that clones any React element and adds an onClick handler to close its parent panel.                                             |  |

### Hooks

| Hook                              | Description                                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`useAccordion()`](#useaccordion) | This hook returns the value of the accordion's [AccordionContext object](#accordioncontextvalue).                     |
| [`useSection()`](#useaccordion)   | This hook returns the value of the accordion [`<Section>`'s](#section) [SectionContext object](#sectioncontextvalue). |
| [`useControls()`](#usecontrols)   | This hook returns the accordion [`<Section>`'s](#section) `open`, `close`, and `toggle` functions.                    |
| [`useDisabled()`](#usecontrols)   | This hook returns the accordion [`<Section>`'s](#section) `disabled` value.                                           |
| [`useIsOpen()`](#useisopen)       | This hook returns the accordion [`<Section>`'s](#section) `isOpen` value.                                             |

### `<Accordion>`

This component creates the context for your accordion section and contains some configuration options.
[`<Section>`s](#section) are the only type of children allowed.

#### Props

| Prop              | Type                                                  | Default     | Required? | Description                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultOpen       | <code>number &#124; number[]</code>                   | `undefined` | No        | The section by index (or sections if `allowMultipleOpen`) you want opened by default.                                                                                            |
| open              | <code>number &#124; number[]</code>                   | `undefined` | No        | Makes this a controlled component where `open`, `close`, `toggle`, controls have no effect. The sections defined here are always the ones that are open.                         |
| allowMultipleOpen | `boolean`                                             | `false`     | No        | Allows multiple sections to be opened at one time.                                                                                                                               |
| allowAllClosed    | `boolean`                                             | `false`     | No        | Allows all of the sections to be closed. If `false`, you must define either the `open` or `defaultOpen` property.                                                                |
| onChange          | <code>(opened: number &#124; number[]) => void</code> | `undefined` | No        | Called each time the open sections change. If `allowMultipleOpen`, the argument will be an array, otherwise a single number. The number corresponds to the open section's index. |
| children          | `React.ReactElement<SectionProps>[]`                  | `undefined` | Yes       | The only children allowed by this component are [`<Section>`s](#section).                                                                                                        |

### `<Section>`

This component creates the context for the accordion panel and trigger contained in this section. It must be a direct
descendent of [`<Accordion>`](#accordion).

#### Props

| Prop     | Type                                                                                    | Default     | Required? | Description                                                                                                      |
| -------- | --------------------------------------------------------------------------------------- | ----------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| id       | `string`                                                                                | `undefined` | No        | Overrides the ID that is auto-generated by this component.                                                       |
| disabled | `boolean`                                                                               | `false`     | No        | `true` if the section should not be allowed to have its `open` state changed.                                    |
| children | <code>React.ReactNode &#124; ((context: SectionContextValue) => React.ReactNode)</code> | `undefined` | Yes       | Sections must include a [`<Trigger>`](#trigger) and a [`Panel`](#panel) in addition to anything else you'd like. |

### `<Trigger>`

This component clones any React element and turns it into a accordion trigger that controls the visible state of
the [`<Panel>`](#panel). It must be a child of [`<Section>`](#section).

#### Props

| Prop        | Type                  | Default     | Required? | Description                                                                                                                                                                                             |
| ----------- | --------------------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| openClass   | `string`              | `undefined` | No        | This class name will be applied to the child element when the section is `open`.                                                                                                                        |
| closedClass | `string`              | `undefined` | No        | This class name will be applied to the child element when the section is `closed`.                                                                                                                      |
| openStyle   | `React.CSSProperties` | `undefined` | No        | These styles will be applied to the child element when the section is `open`.                                                                                                                           |
| closedStyle | `React.CSSProperties` | `undefined` | No        | These styles will be applied to the child element when the section is `closed`.                                                                                                                         |
| children    | `React.ReactElement`  | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as keyboard events for opening the section with `space` and `enter` keys and navigating between sections. |

### `<Panel>`

This component clones any React element and turns it into a accordion section panel. It must be
a child of [`<Section>`](#section).

#### Props

| Prop        | Type                  | Default     | Required? | Description                                                                                                                                                     |
| ----------- | --------------------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| openClass   | `string`              | `undefined` | No        | This class name will be applied to the child element when the section is `open`.                                                                                |
| closedClass | `string`              | `undefined` | No        | This class name will be applied to the child element when the section is `closed`.                                                                              |
| openStyle   | `React.CSSProperties` | `undefined` | No        | These styles will be applied to the child element when the section is `open`.                                                                                   |
| closedStyle | `React.CSSProperties` | `undefined` | No        | These styles will be applied to the child element when the section is `closed`.                                                                                 |
| children    | `React.ReactElement`  | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as keyboard events for closing the section with the `escape` key. |

### `<Close>`

This is a convenience component that clones any React element and adds an onClick handler to close its parent panel. It
must be a child of [`<Section>`](#section).

#### Props

| Prop     | Type                 | Default     | Required? | Description                                                                                                                                                                    |
| -------- | -------------------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children | `React.ReactElement` | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as keyboard events to ensure it acts like a button even if it isn't a native `<button>`. |

### `useAccordion()`

This hook returns the value of the accordion's [AccordionContext object](#accordioncontextvalue). This hook
must be within a child of [`<Accordion>`](#accordion).

### `AccordionContextValue`

```typescript jsx
interface AccordionContextValue {
  // DOM references to the accordion sections
  sections: (HTMLElement | undefined)[]
  // Registers a new accordion section
  registerSection: (index: number, trigger: HTMLElement) => () => void
  // The indexes of the open sections
  opened: number[]
  // Opens a section
  open: (section: number | undefined) => void
  // Closes a section
  close: (section: number | undefined) => void
  // Returns true if a section is open
  isOpen: (section: number | undefined) => boolean
  // Does the accordion allow all of its sections to be closed?
  allowAllClosed: boolean
}
```

### `useSection()`

This hook returns the value of the accordion sections's [SectionContextValue object](#sectioncontextvalue). This hook
must be within a child of [`<Section>`](#section).

### `SectionContextValue`

```typescript jsx
interface SectionContextValue {
  // Is this section open?
  isOpen: boolean
  // Opens this section if not disabled
  open: () => void
  // Closes this section if possible
  close: () => void
  // Toggles the visible state of this section if possible
  toggle: () => void
  // The id of this section
  id?: string
  // The index of this section
  index: number
  // Is the section disabled?
  disabled: boolean
  // The DOM reference to the section's <Trigger>
  triggerRef: React.MutableRefObject<HTMLElement | null>
}
```

### `useControls()`

This hook returns the accordion sections's `open`, `close`, and `toggle` functions. This hook
must be within a child of [`<Section>`](#section).

### `useDisabled()`

This hook returns the accordion sections's `disabled` value. This hook
must be within a child of [`<Section>`](#section).

### `useIsOpen()`

This hook returns the accordion sections's `isOpen` value. This hook
must be within a child of [`<Section>`](#section).

## LICENSE

MIT
