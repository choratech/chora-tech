import * as React from "react"
import { useContext, useState } from "react"
import * as Long from "long"

import { WalletContext } from "chora"
import { signAndBroadcast } from "chora/utils/tx"

import { MsgUpdateCurator } from "../../../api/chora/geonode/v1/msg"

import InputAddress from "../InputAddress"
import InputNumber from "../InputNumber"
import ResultTx from "../ResultTx"

import * as styles from "./MsgUpdateMetadata.module.css"

const MsgUpdateCuratorView = () => {

  const { chainInfo, wallet } = useContext(WalletContext)

  // form input
  const [id, setId] = useState<string>("")
  const [curator, setCurator] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    const msg = {
      $type: "chora.geonode.v1.MsgUpdateCurator",
      id: Long.fromString(id),
      curator: wallet.bech32Address,
      newCurator: curator,
    } as MsgUpdateCurator

    const encMsg = MsgUpdateCurator.encode(msg).finish()

    await signAndBroadcast(chainInfo, wallet.bech32Address, msg, encMsg)
      .then(res => {
        setSuccess(res)
      }).catch(err => {
        setError(err.message)
      })
  }

  return (
    <>
      <div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputNumber
            id="node-id"
            label="node id"
            number={id}
            setNumber={setId}
          />
          <InputAddress
            id="new-curator"
            label="new curator"
            address={curator}
            setAddress={setCurator}
          />
          <button type="submit">
            {"submit"}
          </button>
        </form>
      </div>
      <ResultTx
        error={error}
        rest={chainInfo?.rest}
        success={success}
      />
    </>
  )
}

export default MsgUpdateCuratorView
