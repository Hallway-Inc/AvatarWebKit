import classnames from 'classnames'
import React from 'react'
import { Popover } from 'rsuite'
import { BackgroundOptions } from '../../../avatar/BackgroundOptions'

import styles from './backgroundPopover.module.scss'

type Props = {
  onBackgroundSelected: (background: BackgroundOptions) => void
}

class PopoverContent extends React.PureComponent<Props> {
  render() {
    return (
      <div className={styles.flexContainer}>
        {BackgroundOptions.all.map(background => (
          <div key={background.id} className={classnames(styles.backgroundContainer)}>
            <button onClick={() => this.props.onBackgroundSelected(background)}>{background.name} ({background.size})</button>
          </div>
        ))}
      </div>
    )
  }
}

export const BackgroundPopover = React.forwardRef<HTMLDivElement, Props>(({ onBackgroundSelected, ...props }, ref) => {
  return (
    <div>
      <Popover ref={ref} {...props}>
        <PopoverContent onBackgroundSelected={onBackgroundSelected} />
      </Popover>
    </div>
  )
})