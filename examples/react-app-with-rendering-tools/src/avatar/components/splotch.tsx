import React, { CSSProperties } from 'react'
import { Color, ColorResult, SketchPicker } from 'react-color'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'

import styles from './splotch.module.scss'

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
    return (
      <div className={classnames(styles.container, this.props.className)} style={this.props.style}>
        <div 
          className={styles.splotch} 
          data-tip
          data-for={this.tooltipId} 
          data-event='click' 
          style={{
            backgroundColor: this.state.color.toString()
          }
        }/>

        <label className={styles.label}>{this.props.label}</label>

        <ReactTooltip id={this.tooltipId} effect='solid' type='light' clickable={true}>
          <SketchPicker
            color={this.state.color}
            onChange={color => this.setState({ color: color.hex })}
            onChangeComplete={this.props.onChangeComplete}
          />
        </ReactTooltip>
      </div>
    )
  }
}