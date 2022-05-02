import React, { ChangeEvent } from 'react'

import styles from './menuSelect.module.scss'

type Props = {
  errorMessage?: string
  label: string
  options: { value: string; label: string }[]
  permission?: boolean
  value: string
  onChange: (value: string) => void
}

const _onSelectChange = (onChange: (value: string) => void, event: ChangeEvent<HTMLSelectElement>) => {
  event.stopPropagation()
  onChange(event.target.value)
}

export const MenuSelect = (props: Props) => {
  const { errorMessage, label, permission = true, onChange, options, value } = props

  return (
    <div className={styles.container}>
      {!permission ? (
        <span className={styles.errorMessage}>{errorMessage}</span>
      ) : (
        <select className={styles.select} onChange={_onSelectChange.bind(this, onChange)} value={value}>
          {options.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      )}
      <label className={styles.label}>{label}</label>
    </div>
  )
}
