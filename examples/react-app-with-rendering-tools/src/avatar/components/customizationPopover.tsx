import classnames from 'classnames'
import React from 'react'
import { Popover } from 'rsuite'
import { Splotch } from './splotch'

import styles from './characterPopover.module.scss'
import { ModelSettings } from '@quarkworks-inc/avatar-webkit-rendering'
import { ColorResult } from 'react-color'

type Props = {
  settings: ModelSettings<any>
  onSettingsDidUpdate: (settings: ModelSettings<any>) => void
}

class PopoverContent extends React.PureComponent<Props> {

  private _onColorSelected(settingKey: string, newValue: ColorResult) {
    const { settings } = this.props
    settings[settingKey] = newValue.hex

    this.props.onSettingsDidUpdate(settings)
  }

  render() {
    const { settings } = this.props

    return (
      <div className={styles.flexContainer}>
        {Object.keys(settings).map(settingKey => (
          <div key={settingKey} className={classnames(styles.splotchContainer)}>
            <Splotch
              id={settingKey}
              label={settingKey}
              color={settings[settingKey]}
              onChangeComplete={color => this._onColorSelected(settingKey, color)}
            />
          </div>
        ))}
      </div>
    )
  }
}

export const CustomizationPopover = React.forwardRef<HTMLDivElement, Props>(({ settings, onSettingsDidUpdate, ...props }, ref) => {
  return (
    <div>
      <Popover ref={ref} {...props} onClick={e => e.stopPropagation()}>
        <PopoverContent settings={settings} onSettingsDidUpdate={onSettingsDidUpdate} />
      </Popover>
    </div>
  )
})