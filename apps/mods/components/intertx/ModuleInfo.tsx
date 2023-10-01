'use client'

import { intertxModule } from 'cosmos/modules'
import { useState } from 'react'

import MoreInfo from '@components/MoreInfo'

import styles from './ModuleInfo.module.css'

const ModuleInfo = () => {
  const [showInfo, setShowInfo] = useState<boolean>(false)

  const handleShowInfo = () => {
    setShowInfo(!showInfo)
  }

  return (
    <>
      <button className={styles.infoButton} onClick={handleShowInfo}>
        {showInfo ? 'less info' : 'more info'}
      </button>
      <div className={styles.box}>
        {showInfo && <MoreInfo module={intertxModule} />}
        <ul>
          <li>
            <a href="#msg-register-account">{'MsgRegisterAccount'}</a>
          </li>
          <li>
            <a href="#msg-submit-tx">{'MsgSubmitTx'}</a>
          </li>
          <li>
            <a href="#query-interchain-account">{'QueryInterchainAccount'}</a>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ModuleInfo
