import { Input } from 'antd'
import { debounce } from 'lodash'
import React, { useState } from 'react'

import './Header.css'

const Header = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = debounce((value) => {
    onSearch(value)
  }, 300)

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
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
