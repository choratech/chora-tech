import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"
import Result from "chora/components/Result"
import SelectNetwork from "chora/components/SelectNetwork"

import * as styles from "./QueryAttestationsByAttestor.module.css"

const queryAttestationsByAttestor = "/regen/data/v1/attestations-by-attestor"
const choraAttestorPlaceholder = "chora1jx34255cgvxpthkg572ma6rhq6crwl6xh7g0md"
const regenAttestorPlaceholder = "regen1jx34255cgvxpthkg572ma6rhq6crwl6x2s4ajx"

const QueryAttestationsByAttestor = () => {

  const { chainInfo, network, setNetwork } = useContext(WalletContext)

  const [attestor, setAttestor] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  let attestorPlaceholder: string
  if (network === undefined || network.includes("chora")) {
    attestorPlaceholder = choraAttestorPlaceholder
  } else {
    attestorPlaceholder = regenAttestorPlaceholder
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryAttestationsByAttestor + "/" + attestor)
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          setError(data.message)
        } else {
          setSuccess(JSON.stringify(data, null, "  "))
        }
      })
      .catch(err => {
        setError(err.message)
      })
  }

  return (
    <>
      <div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="attestor">
            {"attestor"}
            <input
              id="attestor"
              value={attestor}
              placeholder={attestorPlaceholder}
              onChange={event => setAttestor(event.target.value)}
            />
          </label>
          <SelectNetwork
            network={network}
            setNetwork={setNetwork}
          />
          <button type="submit">
            {"search"}
          </button>
        </form>
      </div>
      <Result
        error={error}
        success={success}
      />
    </>
  )
}

export default QueryAttestationsByAttestor
