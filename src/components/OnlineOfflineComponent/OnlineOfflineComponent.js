import React from 'react'
import { Button } from 'antd'
import { Online, Offline } from 'react-detect-offline'

import { NO_INTERNET_MESSAGE } from '../../constants/constants'
import './OnlineOfflineComponent.css'

export const OnlineOfflineComponent = ({
  activeTab,
  handleTabChange,
  renderSearchTab,
  renderRatedTab,
}) => {
  return (
    <>
      <Online>
        <div className="basic">
          <div className="tabs">
            <Button
              className={activeTab === 'search' ? 'active' : ''}
              onClick={() => handleTabChange('search')}
            >
              Search
            </Button>
            <Button
              className={activeTab === 'rated' ? 'active' : ''}
              onClick={() => handleTabChange('rated')}
            >
              Rated
            </Button>
          </div>
          {activeTab === 'search' ? renderSearchTab() : renderRatedTab()}
        </div>
      </Online>
      <Offline>
        <div className="no-internet">
          <div className="no-internet-book" />
          <span className="no-internet-book__text">{NO_INTERNET_MESSAGE}</span>
        </div>
      </Offline>
    </>
  )
}

export default OnlineOfflineComponent
