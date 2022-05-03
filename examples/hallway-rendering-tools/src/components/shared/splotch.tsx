import React, { CSSProperties } from 'react'
import { Color, ColorResult, SketchPicker } from 'react-color'
import classnames from 'classnames'

import styles from './splotch.module.scss'
import { Popover, Whisper } from 'rsuite'

type Props = {
  id: string
  label: string
  color: Color
  className?: string
  style?: CSSProperties
  onChangeComplete: (color: ColorResult) => void
}

type State = {
  color: Color
}

export class Splotch extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      color: props.color
    }
  }

  get tooltipId(): string {
    return `tooltip_${this.props.id}`
  }

  render() {
    const popover = (
      <Popover>
        <SketchPicker
            color={this.state.color}
            onChange={color => this.setState({ color: color.hex })}
            onChangeComplete={this.props.onChangeComplete}
          />
      </Popover>
    )

    return (
      <div className={classnames(styles.container, this.props.className)} style={this.props.style}>

        <Whisper
          controlId={this.tooltipId}
          trigger="click"
          placement="top"
          speaker={popover}
        >
          <div 
            className={styles.splotch}
            style={{
              backgroundColor: this.state.color.toString()
            }
          }/>
        </Whisper>

        <label className={styles.label}>{this.props.label}</label>
      </div>
    )
  }
}