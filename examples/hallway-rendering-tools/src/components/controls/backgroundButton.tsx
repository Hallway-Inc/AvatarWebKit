import React from 'react'
import { Whisper } from 'rsuite'

import styles from './backgroundButton.module.scss'
import { ReactComponent as BackgroundsSvg } from '../../assets/icons/backgrounds.svg'
import { BackgroundOptions } from '../../avatar/BackgroundOptions'
import { BackgroundPopover } from './popovers/backgroundPopover'

const tooltipId = 'BackgroundButton__tooltip'

type Props = {
  selectedBackground: BackgroundOptions
  onBackgroundSelected: (background: BackgroundOptions) => void
}

export class BackgroundButton extends React.PureComponent<Props> {
  render() {
    const popover = <BackgroundPopover onBackgroundSelected={this.props.onBackgroundSelected} />

    return <>
      <Whisper
        trigger="click"
        placement="top"
        controlId={tooltipId}
        speaker={popover}
      >
        <div className={styles.button}>
          <BackgroundsSvg />
        </div>
      </Whisper>
    </>
  }
}