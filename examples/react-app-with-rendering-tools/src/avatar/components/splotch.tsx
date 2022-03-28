import React from 'react'
import { Color, SketchPicker } from 'react-color'
import ReactTooltip from 'react-tooltip'

type Props = {
  id: string
  label: string
  color: Color
  onChangeComplete: (Color) => void
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
      <>
        <button data-tip data-for={this.tooltipId} data-event='click'>{this.props.label}</button>

        <ReactTooltip id={this.tooltipId} effect='solid' type='light' clickable={true}>
          <SketchPicker color={this.state.color} onChange={color => this.setState({ color: color.hex })} onChangeComplete={this.props.onChangeComplete} />
        </ReactTooltip>
      </>
    )
  }
}