import React from 'react'

import styles from './switch.module.scss'

type Props = {
  isOn: boolean
  handleToggle: () => void
  onColor: string
}

export class Switch extends React.Component<Props> {
  render() {
    return (
      <>
        <input
          checked={this.props.isOn}
          onChange={this.props.handleToggle}
          className={styles.checkbox}
          id="react-switch-new"
          type="checkbox"
        />
        <label
          style={{ background: this.props.isOn && this.props.onColor }}
          className={styles.label}
          htmlFor="react-switch-new"
        >
          <span className={styles.button} />
        </label>
      </>
    )
  }
}
