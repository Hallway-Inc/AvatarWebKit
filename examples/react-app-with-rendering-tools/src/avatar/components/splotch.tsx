import React from 'react'
import ReactTooltip from 'react-tooltip'

export type Color = string | number

type Props = {
  label: string
  color: Color
}

export class Splotch extends React.PureComponent<Props> {


  render() {
    return (
      <>
        <button data-tip data-for='happyFace'>{this.props.label}</button>

        {/* <a data-tip data-for='happyFace'> d(`･∀･)b </a> */}

        <ReactTooltip id='happyFace' type='error'>
          <span>Show happy face</span>
        </ReactTooltip>
      </>
    )
  }
}