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
  <Accordion defaultActive={0}>
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

| Hook                              | Description                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`useAccordion()`](#useaccordion) | This hook provides the value of the accordion's [AccordionContextValue object](#accordioncontextvalue).      |
| [`useSection()`](#useaccordion)   | This hook provides the value of the accordion sections's [SectionContextValue object](#sectioncontextvalue). |
| [`useControls()`](#usecontrols)   | This hook provides access to the accordion sections's `open`, `close`, and `toggle` functions.               |
| [`useIsOpen()`](#useisopen)       | This hook provides access to the accordion sections's `isOpen` value.                                        |

### `<Accordion>`

This component creates the context for your accordion section and contains some configuration options.
[`<Section>`s](#accordion) are the only type of children allowed.

#### Props

| Prop     | Type                                 | Default     | Required? | Description |
| -------- | ------------------------------------ | ----------- | --------- | ----------- |
| children | `React.ReactElement<SectionProps>[]` | `undefined` | Yes       |             |

### `<Section>`

This component creates the context for the accordion panel and trigger contained in this section. It must be a direct
descendent of [`<Accordion>`](#accordion).

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `<Trigger>`

This component clones any React element and turns it into a accordion trigger that controls the visible state of the panel.

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `<Panel>`

This component clones any React element and turns it into a accordion panel.

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `<Close>`

This is a convenience component that clones any React element and adds an onClick handler to close its parent panel.

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `useAccordion()`

This hook provides the value of the accordion's [AccordionContextValue object](#accordioncontextvalue).

### `useSection()`

This hook provides the value of the accordion sections's [SectionContextValue object](#sectioncontextvalue).

### `useControls()`

This hook provides access to the accordion sections's `open`, `close`, and `toggle` functions.

### `useIsOpen()`

This hook provides access to the accordion sections's `isOpen` value.

## LICENSE

MIT
