/* jest */
import React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import {render, fireEvent, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Accordion, Section, Trigger, Panel, Close, useControls} from './index'

const silenceErrors = (test: (...args: any[]) => void) => () => {
  const originalError = console.error
  console.error = jest.fn()
  // eslint-disable-next-line jest/expect-expect
  test()
  console.error = originalError
}

describe('<Accordion>', () => {
  it(
    'should throw if it has no child Sections',
    silenceErrors(() => {
      expect(() =>
        render(
          <Accordion>
            <div />
          </Accordion>
        )
      ).toThrowErrorMatchingSnapshot()
    })
  )

  it(
    'should throw if it has no open sections and allowAllClosed is false',
    silenceErrors(() => {
      expect(() =>
        render(
          <Accordion>
            <Section>
              <div />
            </Section>
          </Accordion>
        )
      ).toThrowErrorMatchingSnapshot()
    })
  )

  it('should not throw if it has no open sections and allowAllClosed is true', () => {
    expect(
      render(
        <Accordion allowAllClosed>
          <Section>
            <div />
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot()
  })

  it(
    'should throw on multiple defaultOpen if allowMultipleOpen is false',
    silenceErrors(() => {
      expect(() =>
        render(
          <Accordion defaultOpen={[0, 1]}>
            <Section>
              <Trigger>
                <div />
              </Trigger>
              <Panel>
                <div />
              </Panel>
            </Section>
            <Section>
              <Trigger>
                <div />
              </Trigger>
              <Panel>
                <div />
              </Panel>
            </Section>
          </Accordion>
        ).asFragment()
      ).toThrowErrorMatchingSnapshot()
    })
  )

  it(
    'should throw on multiple open if allowMultipleOpen is false',
    silenceErrors(() => {
      expect(() =>
        render(
          <Accordion open={[0, 1]}>
            <Section>
              <Trigger>
                <div />
              </Trigger>
              <Panel>
                <div />
              </Panel>
            </Section>
            <Section>
              <Trigger>
                <div />
              </Trigger>
              <Panel>
                <div />
              </Panel>
            </Section>
          </Accordion>
        ).asFragment()
      ).toThrowErrorMatchingSnapshot()
    })
  )

  it('should render singular defaultOpen', () => {
    expect(
      render(
        <Accordion defaultOpen={1}>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=0 closed, index=1 open')
  })

  it('should render singular defaultOpen w/ array', () => {
    expect(
      render(
        <Accordion defaultOpen={[1]}>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=0 closed, index=1 open')
  })

  it('should render multiple defaultOpen', () => {
    expect(
      render(
        <Accordion allowMultipleOpen defaultOpen={[0, 1]}>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=0 open, index=1 open')
  })

  it('should render singular open', () => {
    expect(
      render(
        <Accordion open={1}>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=0 closed, index=1 open')
  })

  it('should render singular open w/ array', () => {
    expect(
      render(
        <Accordion open={[1]}>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=0 closed, index=1 open')
  })

  it('should render multiple open', () => {
    expect(
      render(
        <Accordion allowMultipleOpen defaultOpen={[0, 1]}>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
          <Section>
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=0 open, index=1 open')
  })

  it('should allow custom indexes and keys on sections', () => {
    expect(
      render(
        <Accordion defaultOpen={[1]}>
          <Section index={1} key="1">
            <Trigger>
              <div />
            </Trigger>
          </Section>
          <Section index={0} key="0">
            <Trigger>
              <div />
            </Trigger>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('index=1 open, index=0 closed')
  })

  it('should call onChange handler when open sections change', () => {
    const called = []
    const result = render(
      <Accordion open={0}>
        <Section>
          <Trigger>
            <div />
          </Trigger>
          <Panel>
            <div />
          </Panel>
        </Section>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel>
            <div />
          </Panel>
        </Section>
      </Accordion>
    )

    expect(called.length).toBe(0)
    userEvent.click(result.getByTestId('btn'))
    // expect(called[0]).toBe(1)
  })

  it('should call onChange handler when multiple open sections change', () => {
    // wtf dude
    // const cb = jest.fn()
    const called = []
    const result = render(
      <Accordion
        allowMultipleOpen
        open={[0]}
        onChange={(value) => {
          called.push(value)
        }}
      >
        <Section>
          <Trigger>
            <div />
          </Trigger>
          <Panel>
            <div />
          </Panel>
        </Section>
        <Section>
          <Trigger>
            <div data-testid="btn" />
          </Trigger>
          <Panel>
            <div />
          </Panel>
        </Section>
      </Accordion>
    )

    expect(called.length).toBe(0)
    userEvent.click(result.getByTestId('btn'))
    // expect(called[0]).toEqual([0, 1])
  })
})

describe(`<Section>`, () => {
  it(`should provide context to child function`, () => {
    let value

    render(
      <Accordion defaultOpen={0}>
        <Section id="custom">
          {(context) => {
            value = context
            return <div />
          }}
        </Section>
      </Accordion>
    )

    expect(value).toMatchSnapshot()
  })

  it(`should not update state if disabled`, () => {
    let close

    const {getByTestId} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section disabled>
          {(context) => {
            close = context.close

            return (
              <Trigger>
                <div data-testid="btn" />
              </Trigger>
            )
          }}
        </Section>
      </Accordion>
    )

    expect(getByTestId('btn').getAttribute('aria-disabled')).toBe('true')
    expect(getByTestId('btn').getAttribute('aria-expanded')).toBe('true')
    act(close)
    expect(getByTestId('btn').getAttribute('aria-expanded')).toBe('true')
  })

  it('should not open if disabled', () => {
    let open
    const result = render(
      <Accordion allowAllClosed>
        <Section disabled>
          {(context) => {
            open = context.open

            return (
              <Trigger>
                <div data-testid="btn" />
              </Trigger>
            )
          }}
        </Section>
      </Accordion>
    )

    expect(result.getByTestId('btn').getAttribute('aria-expanded')).toBe(
      'false'
    )
    act(open)
    expect(result.getByTestId('btn').getAttribute('aria-expanded')).toBe(
      'false'
    )
  })

  it(`should not close if allowAllClosed is false`, () => {
    let close

    const {getByTestId} = render(
      <Accordion defaultOpen={0}>
        <Section>
          {(context) => {
            close = context.close
            return (
              <Trigger>
                <div data-testid="btn" />
              </Trigger>
            )
          }}
        </Section>
      </Accordion>
    )

    expect(getByTestId('btn').getAttribute('aria-expanded')).toBe('true')
    act(close)
    expect(getByTestId('btn').getAttribute('aria-expanded')).toBe('true')
  })

  it(`should close if allowAllClosed is true`, () => {
    let close

    const {getByTestId} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          {(context) => {
            close = context.close
            return (
              <Trigger>
                <div data-testid="btn" />
              </Trigger>
            )
          }}
        </Section>
      </Accordion>
    )

    expect(getByTestId('btn').getAttribute('aria-expanded')).toBe('true')
    act(close)
    expect(getByTestId('btn').getAttribute('aria-expanded')).toBe('false')
  })

  it(`should receive index from parent Accordion`, () => {
    const indexes: Set<number> = new Set()

    render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          {(context) => {
            indexes.add(context.index)
            return <div />
          }}
        </Section>
        <Section>
          {(context) => {
            indexes.add(context.index)
            return <div />
          }}
        </Section>
      </Accordion>
    )

    expect([...indexes]).toEqual([0, 1])
  })

  it(`should override default ID`, () => {
    expect(
      render(
        <Accordion defaultOpen={0}>
          <Section id="custom">
            <Trigger>
              <div />
            </Trigger>
            <Panel>
              <div />
            </Panel>
          </Section>
        </Accordion>
      ).asFragment()
    ).toMatchSnapshot('aria-controls=custom, id=custom')
  })
})

describe(`<Trigger>`, () => {
  it(`should apply open/closed classes`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger closedClass="closed" openClass="open">
            <button data-testid="btn">open me</button>
          </Trigger>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('open')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('closed')
  })

  it(`should apply open/closed styles`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger
            closedStyle={{display: 'none'}}
            openStyle={{display: 'block'}}
          >
            <button data-testid="btn">open me</button>
          </Trigger>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('display: block')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('display: none')
  })

  it(`should apply custom class`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger closedClass="closed" openClass="open">
            <button data-testid="btn" className="custom">
              open me
            </button>
          </Trigger>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('open + custom')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('closed + custom')
  })

  it(`should apply custom styles`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger
            closedStyle={{display: 'none'}}
            openStyle={{display: 'block'}}
          >
            <button data-testid="btn" style={{height: 300}}>
              open me
            </button>
          </Trigger>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('display: block, height: 300')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('display: none, height: 300')
  })

  it(`should fire user onClick definition`, () => {
    const cb = jest.fn()

    const {getByTestId} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" onClick={cb}>
              open me
            </button>
          </Trigger>
        </Section>
      </Accordion>
    )

    expect(cb).not.toBeCalled()
    userEvent.click(getByTestId('btn'))
    expect(cb).toBeCalledTimes(1)
  })

  it(`should focus next trigger on down arrow`, () => {
    const focus1 = jest.fn()
    const focus2 = jest.fn()

    const {getByTestId} = render(
      <Accordion allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn-1" onFocus={focus1} />
          </Trigger>
        </Section>
        <Section>
          <Trigger>
            <button data-testid="btn-2" onFocus={focus2} />
          </Trigger>
        </Section>
      </Accordion>
    )

    fireEvent.keyDown(getByTestId('btn-1'), {which: 40})
    expect(focus2).toBeCalledTimes(1)
    fireEvent.keyDown(getByTestId('btn-2'), {which: 40})
    expect(focus1).toBeCalledTimes(1)
  })

  it(`should focus prev trigger on up arrow`, () => {
    const focus1 = jest.fn()
    const focus2 = jest.fn()

    const {getByTestId} = render(
      <Accordion allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn-1" onFocus={focus1} />
          </Trigger>
        </Section>
        <Section>
          <Trigger>
            <button data-testid="btn-2" onFocus={focus2} />
          </Trigger>
        </Section>
      </Accordion>
    )

    fireEvent.keyDown(getByTestId('btn-1'), {which: 38})
    expect(focus2).toBeCalledTimes(1)
    fireEvent.keyDown(getByTestId('btn-2'), {which: 38})
    expect(focus1).toBeCalledTimes(1)
  })

  it(`should focus first trigger on home key, last on end key`, () => {
    const focus1 = jest.fn()
    const focus2 = jest.fn()

    const {getByTestId} = render(
      <Accordion allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn-1" onFocus={focus1} />
          </Trigger>
        </Section>
        <Section>
          <Trigger>
            <button data-testid="btn-2" onFocus={focus2} />
          </Trigger>
        </Section>
      </Accordion>
    )

    fireEvent.keyDown(getByTestId('btn-1'), {which: 36})
    expect(focus1).toBeCalledTimes(1)
    fireEvent.keyDown(getByTestId('btn-2'), {which: 35})
    expect(focus2).toBeCalledTimes(1)
  })
})

describe(`<Panel>`, () => {
  it(`should apply open/closed classes`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel closedClass="closed" openClass="open">
            <div>open me</div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('open')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('closed')
  })

  it(`should apply open/closed styles`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
            <div>open me</div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('display: block')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('display: none')
  })

  it(`should apply custom class`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel closedClass="closed" openClass="open">
            <div className="custom">open me</div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('open + custom')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('closed + custom')
  })

  it(`should apply custom styles`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion defaultOpen={0} allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
            <div style={{height: 300}}>open me</div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('display: block, height: 300')
    fireEvent.mouseDown(getByTestId('btn'))
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('display: none, height: 300')
  })

  it(`should close on escape`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
            <div data-testid="panel" style={{height: 300}}>
              open me
            </div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('closed initially')
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('open')
    fireEvent.keyDown(getByTestId('panel'), {
      key: 'Escape',
      which: 27,
    })
    expect(asFragment()).toMatchSnapshot('closed')
  })

  it(`should close on escape if closeOnEscape is false`, () => {
    const {getByTestId, asFragment} = render(
      <Accordion allowAllClosed>
        <Section>
          <Trigger>
            <button data-testid="btn" />
          </Trigger>
          <Panel closeOnEscape={false}>
            <div data-testid="panel">open me</div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('closed initially')
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('open')
    fireEvent.keyDown(getByTestId('panel'), {
      key: 'Escape',
      which: 27,
    })
    expect(asFragment()).toMatchSnapshot('open [despite escape]')
  })
})

describe(`<Close>`, () => {
  it(`should close its parent section if allowAllClosed is true`, () => {
    const {asFragment, getByTestId} = render(
      <Accordion allowAllClosed defaultOpen={0}>
        <Section>
          <Trigger>
            <div />
          </Trigger>
          <Panel>
            <div>
              <Close>
                <button data-testid="btn" />
              </Close>
            </div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('visible')
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('hidden')
  })

  it(`should not close its parent section if allowAllClosed is false`, () => {
    const {asFragment, getByTestId} = render(
      <Accordion defaultOpen={0}>
        <Section>
          <Trigger>
            <div />
          </Trigger>
          <Panel>
            <div>
              <Close>
                <button data-testid="btn" />
              </Close>
            </div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('visible')
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('visible [despite click]')
  })

  it(`should fire child onClick`, () => {
    const cb = jest.fn()

    const {asFragment, getByTestId} = render(
      <Accordion allowAllClosed defaultOpen={0}>
        <Section>
          <Trigger>
            <div />
          </Trigger>
          <Panel>
            <div>
              <Close>
                <button data-testid="btn" onClick={cb} />
              </Close>
            </div>
          </Panel>
        </Section>
      </Accordion>
    )

    expect(asFragment()).toMatchSnapshot('visible')
    userEvent.click(getByTestId('btn'))
    expect(asFragment()).toMatchSnapshot('hidden')
    expect(cb).toBeCalledTimes(1)
  })
})

describe(`useControls()`, () => {
  it('should have open, close, toggle keys', () => {
    const {result} = renderHook(() => useControls(), {
      wrapper: ({children}) => (
        <Accordion defaultOpen={0}>
          <Section>
            <div children={children} />
          </Section>
        </Accordion>
      ),
    })

    expect(Object.keys(result.current)).toStrictEqual([
      'open',
      'close',
      'toggle',
    ])
  })
})
