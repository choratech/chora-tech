'use client'

import { WalletContext } from 'chora'
import { ResultTx } from 'chora/components'
import { MsgGrant as MsgInputs } from 'chora/components/authz'
import { signAndBroadcast } from 'chora/utils'
import { useContext, useState } from 'react'

import styles from './MsgGrant.module.css'

const MsgGrant = () => {
  const { chainInfo, wallet } = useContext(WalletContext)

  const [message, setMessage] = useState<any>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError(undefined)
    setSuccess(undefined)

    await signAndBroadcast(chainInfo, wallet['bech32Address'], [message])
      .then((res) => {
        setSuccess(res)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div id="msg-grant" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>{'MsgGrant'}</h2>
        <p>{'grant an authorization'}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <MsgInputs setMessage={setMessage} useWallet={true} wallet={wallet} />
        <button type="submit">{'submit'}</button>
      </form>
      <ResultTx error={error} rest={chainInfo?.rest} success={success} />
    </div>
  )
}

export default MsgGrant
