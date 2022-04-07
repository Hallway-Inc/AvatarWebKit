import React from 'react'
import { Whisper } from 'rsuite'

import styles from './characterButton.module.scss'

import { CharacterPopover } from './popovers/characterPopover'
import { AvatarOptions } from '../../avatar/AvatarOptions'

const tooltipId = 'CharacterButton__tooltip'

type Props = {
  selectedAvatar: AvatarOptions
  onAvatarSelected: (avatar: AvatarOptions) => void
}

export class CharacterButton extends React.PureComponent<Props> {
  render() {
    const popover = <CharacterPopover onAvatarSelected={this.props.onAvatarSelected} />

    return <>
      <Whisper
        trigger="click"
        placement="top"
        controlId={tooltipId}
        speaker={popover}
      >
        <div className={styles.button}>
          <img src={this.props.selectedAvatar.thumbnail} alt="Choose character" width={80} height={64} />
        </div>
      </Whisper>
    </>
  }
}