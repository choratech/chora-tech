'use client'

import { WalletContext } from 'chora'
import { InputNumber, Result } from 'chora/components'
import { useContext, useState } from 'react'

import styles from './QueryGroupInfo.module.css'

const queryGroupInfo = '/cosmos/group/v1/group_info'

const QueryGroupInfo = () => {
  const { chainInfo } = useContext(WalletContext)

  // form input
  const [id, setId] = useState<string>('')

  // error and success
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError(undefined)
    setSuccess(undefined)

    fetch(chainInfo.rest + queryGroupInfo + '/' + id)
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setError(data.message)
        } else {
          setSuccess(JSON.stringify(data, null, '  '))
        }
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div id="query-group-info" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>{'QueryGroupInfo'}</h2>
        <p>{'query a group by the id of the group'}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputNumber
          id="query-group-info-id"
          label="group id"
          number={id}
          setNumber={setId}
        />
        <button type="submit">{'search'}</button>
      </form>
      <Result error={error} success={success} />
    </div>
  )
}

export default QueryGroupInfo
