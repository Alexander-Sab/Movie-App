import { Input } from 'antd'
import { debounce } from 'lodash'
import React, { useState } from 'react'

import { DEBOUNCE_DELAY } from '../../constants/constants'
import './Header.css'

export const Header = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('')
  const handleSearchChange = debounce((value) => {
    onSearch(value)
  }, DEBOUNCE_DELAY)
  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    handleSearchChange.cancel() // Отменяем предыдущий запланированный вызов
    if (value.trim() !== '') {
      handleSearchChange(value)
    }
  }
  return (
    <div className="control">
      <Input
        className="control-search"
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default Header
