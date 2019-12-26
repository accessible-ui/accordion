/* jest */
import React from 'react'
// import {renderHook} from '@testing-library/react-hooks'
import {render} from '@testing-library/react'
import {Accordion, Panel, Trigger, Target} from './index'

describe('<Accordion>', () => {
  it('should do something', () => {
    render(
      <Accordion>
        <Panel>
          <Trigger>
            <button>Open</button>
          </Trigger>
          <Target>
            <div>Hello</div>
          </Target>
        </Panel>
      </Accordion>
    )
  })
})
