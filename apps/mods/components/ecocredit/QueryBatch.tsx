import { useContext, useState } from 'react'

import { WalletContext } from 'chora'
import { InputString, Result } from 'chora/components'

import styles from './QueryBatch.module.css'

const queryBatch = '/regen/ecocredit/v1/batch'

const QueryBatch = () => {
  const { chainInfo } = useContext(WalletContext)

  // form input
  const [denom, setDenom] = useState<string>('')

  // error and success
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError(undefined)
    setSuccess(undefined)

    fetch(chainInfo.rest + queryBatch + '/' + denom)
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
    <div id="query-batch" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>{'QueryBatch'}</h2>
        <p>{'query a credit batch by denom'}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputString
          id="query-batch-denom"
          label="batch denom"
          placeholder="C01-001-20200101-20210101-001"
          string={denom}
          setString={setDenom}
        />
        <button type="submit">{'search'}</button>
      </form>
      <Result error={error} success={success} />
    </div>
  )
}

export default QueryBatch
