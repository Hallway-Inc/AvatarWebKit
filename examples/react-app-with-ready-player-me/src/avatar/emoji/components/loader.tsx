import classNames from 'classnames'
import React from 'react'
import { Property } from 'csstype'

import styles from './loader.module.scss'

type Props = {
  position: 'absolute' | 'relative'
  width: number
  height: number
  color?: Property.Color
  thickness?: 1 | 2
  subtext?: JSX.Element | string
  versionLabel?: string
}

export class Loader extends React.PureComponent<Props> {
  render() {
    const { position, width, height, color, thickness, subtext, versionLabel } = this.props
    return (
      <div
        className={classNames({
          [styles.loaderContainer]: true,
          [styles.fullSize]: position === 'absolute'
        })}
        style={{ position }}
      >
        <div
          className={styles.loader}
          style={{
            width,
            height,
            borderColor: color,
            borderWidth: thickness
          }}
        />
        {versionLabel && <div className={styles.version}>{versionLabel}</div>}
        {subtext && <div className={styles.loaderText}>{subtext}</div>}
      </div>
    )
  }
}
