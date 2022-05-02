import classnames from 'classnames'
import React from 'react'
import { Popover } from 'rsuite'
import { ModelColorSetting, ModelSettings, ModelSettingType } from '@quarkworks-inc/avatar-webkit-rendering'
import { ColorResult } from 'react-color'

import { Splotch } from '../../shared/splotch'

import styles from './characterPopover.module.scss'

type Props = {
  settings: ModelSettings
  onSettingsDidUpdate: (settings: ModelSettings) => void
}

class PopoverContent extends React.PureComponent<Props> {

  private _onColorSelected(settingKey: string, newValue: ColorResult) {
    const { settings } = this.props
    settings[settingKey].value = newValue.hex

    this.props.onSettingsDidUpdate(settings)
  }

  render() {
    const { settings } = this.props

    return (
      <div className={styles.flexContainer}>
        {Object.keys(settings).map(settingKey => {
          const anySetting = settings[settingKey]

          if (anySetting.type !== ModelSettingType.color) {
            console.warn('Nothing to handle non color options yet.')
            return undefined
          }

          const setting = anySetting as ModelColorSetting

          switch (setting.type) {
            case ModelSettingType.color:
              return (
                <div key={settingKey} className={classnames(styles.splotchContainer)}>
                  <Splotch
                    id={settingKey}
                    label={setting.name}
                    color={setting.value}
                    onChangeComplete={color => this._onColorSelected(settingKey, color)}
                  />
                </div>
              )
            default: return undefined
          }

        })}
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