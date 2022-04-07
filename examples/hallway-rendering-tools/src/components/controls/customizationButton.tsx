import React from 'react'
import classNames from 'classnames'
import { Whisper } from 'rsuite'
import { ModelSettings } from '@quarkworks-inc/avatar-webkit-rendering'

import styles from './customizationButton.module.scss'

import { ReactComponent as ArtSvg } from '../../assets/icons/art.svg'
import { CustomizationPopover } from './popovers/customizationPopover'

const tooltipId = 'CustomizationButton__tooltip'

type Props = {
  settings: ModelSettings
  onSettingsDidUpdate: (settings: ModelSettings) => void
}

type State = {
  isPopoverOpen: boolean
}

export class CustomizationButton extends React.Component<Props, State> {
  
  state: State = {
    isPopoverOpen: false
  }

  get isDisabled(): boolean {
    return Object.keys(this.props.settings ?? {}).length === 0
  }

  componentDidMount(): void {
    this.onWindowClicked = this.onWindowClicked.bind(this)
    window.addEventListener('click', this.onWindowClicked)
  }

  componentWillUnmount(): void {
    window.removeEventListener('click', this.onWindowClicked)
  }

  onWindowClicked() {
    this.setState({ isPopoverOpen: false })
  }

  buttonWasClicked(e: React.MouseEvent) {
    e.stopPropagation()
    const { isPopoverOpen } = this.state

    if (isPopoverOpen) {
      this.setState({ isPopoverOpen: false })
    } else {
      // Prevents opening when it should be disabled
      if (!this.isDisabled) {
        this.setState({ isPopoverOpen: true })
      }
    }
  }
  
  render() {
    const { settings, onSettingsDidUpdate } = this.props

    const popover = (
      <CustomizationPopover
        settings={settings}
        onSettingsDidUpdate={onSettingsDidUpdate}
      />
    )

    // Clicks are handled manually for this popover component because it contains a child popover that overflows
    return <>
      <Whisper
        trigger="none"
        open={this.state.isPopoverOpen}
        onClick={(e) => this.buttonWasClicked(e)}
        placement="bottom"
        controlId={tooltipId}
        speaker={popover}
      >
        <div className={classNames({
          [styles.button]: true,
          [styles.disabled]: this.isDisabled
        })}>
          <ArtSvg />
        </div>
      </Whisper>
    </>
  }
}