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

An accessible and versatile accordion for React

## Features
- **Style-agnostic** You can use this component with the styling library of your choice. It
  works with CSS-in-JS, SASS, plain CSS, plain `style` objects, anything!
- *aria-compliant keyboard navigation* Keyboard navigation is compliant with the examples shown [here](https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html)

## Quick Start
[Check out the example on CodeSandbox](https://codesandbox.io/s/accessibleaccordion-example-7ylck)

```jsx harmony
import {Accordion, Panel, Trigger, Target} from '@accessible/accordion'

const Component = () => (
  <Accordion defaultActive={0}>
    <Panel>
      <Trigger>
        <h2>Section 1</h2>
      </Trigger>
      <Target>
        <div className='panel'>
          Section 1 content
        </div>
      </Target>
    </Panel>

    <Panel>
      <Trigger>
        <h2>Section 2</h2>
      </Trigger>
      <Target>
        <div className='panel'>
          Section 2 content
        </div>
      </Target>
    </Panel>
  </Accordion>
)
```

## API

### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

## LICENSE

MIT
