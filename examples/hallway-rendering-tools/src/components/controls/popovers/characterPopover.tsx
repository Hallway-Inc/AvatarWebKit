import classnames from 'classnames'
import React from 'react'
import { Popover } from 'rsuite'
import { AvatarOptions } from '../../../avatar/AvatarOptions'

import styles from './characterPopover.module.scss'

type Props = {
  onAvatarSelected: (avatar: AvatarOptions) => void
}

class PopoverContent extends React.PureComponent<Props> {
  render() {
    return (
      <div className={styles.flexContainer}>
        {AvatarOptions.all.map(avatar => (
          <div key={avatar.id} className={classnames(styles.avatarContainer)}>
            <img
              className={styles.avatar}
              src={avatar.thumbnail}
              alt={avatar.name}
              onClick={() => this.props.onAvatarSelected(avatar)}
            />
    
            <label className={styles.label}>{avatar.name}</label>
          </div>
        ))}
      </div>
    )
  }
}

export const CharacterPopover = React.forwardRef<HTMLDivElement, Props>(({ onAvatarSelected, ...props }, ref) => {
  return (
    <div>
      <Popover ref={ref} {...props}>
        <PopoverContent onAvatarSelected={onAvatarSelected} />
      </Popover>
    </div>
  )
})