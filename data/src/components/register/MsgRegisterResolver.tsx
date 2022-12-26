import * as React from "react"
import { useContext, useState } from "react"
import { Buffer } from "buffer"
import * as Long from 'long'

import { SignMode } from "@keplr-wallet/proto-types/cosmos/tx/signing/v1beta1/signing"
import { AuthInfo, TxBody, TxRaw } from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx"
import { BroadcastMode, SignDoc } from "@keplr-wallet/types"

import { WalletContext } from "../../context/WalletContext"
import { MsgRegisterResolver } from "../../../api/regen/data/v1/tx"
import InputHash from "../InputHash"
import InputHashJSON from "../InputHashJSON"
import InputResolverId from "../InputResolverId"
import SelectDataType from "../SelectDataType"
import SelectDigestAlgorithm from "../SelectDigestAlgorithm"
import SelectInput from "../SelectInput"
import SelectGraphCanon from "../SelectGraphCanon"
import SelectGraphMerkle from "../SelectGraphMerkle"
import SelectRawMedia from "../SelectRawMedia"

import * as styles from "./MsgRegisterResolver.module.css"

const queryAccount = "/cosmos/auth/v1beta1/accounts"
const queryTx = "/cosmos/tx/v1beta1/txs"

const MsgRegisterResolverView = () => {

  // @ts-ignore
  const { chainInfo, wallet } = useContext(WalletContext)

  // input option
  const [input, setInput] = useState("form")

  // resolver id input
  const [id, setId] = useState<string>("")

  // content hash form input
  const [hash, setHash] = useState<string>("")
  const [type, setType] = useState<string>("")
  const [media, setMedia] = useState<number>(0)

  // content hash json input
  const [json, setJson] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    const sender = wallet.bech32Address

    let accountSequence: string
    let accountNumber: number

    // fetch account number and sequence
    await fetch(chainInfo.rest + queryAccount + "/" + sender)
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          setError("error fetching account: " + data.message)
        } else {
          accountNumber = data.account.account_number
          accountSequence = data.account.sequence
        }
      })
      .catch(err => {
        setError("error fetching account: " + err.message)
      })

    // @ts-ignore
    if (accountSequence == undefined || accountNumber == undefined) {
      return // exit if fetch account unsuccessful
    }

    let msg: MsgRegisterResolver
    if (input == "form") {
      if (type == "graph") {
        msg = {
          $type: "regen.data.v1.MsgRegisterResolver",
          manager: sender,
          resolverId: Long.fromString(id),
          contentHashes: [
            {
              $type: "regen.data.v1.ContentHash",
              graph: {
                $type: "regen.data.v1.ContentHash.Graph",
                hash: Buffer.from(hash, "base64"),
                digestAlgorithm: 1, // DIGEST_ALGORITHM_BLAKE2B_256
                canonicalizationAlgorithm: 1, // GRAPH_CANONICALIZATION_ALGORITHM_URDNA2015
                merkleTree: 0, // GRAPH_MERKLE_TREE_NONE_UNSPECIFIED
              },
            },
          ],
        }
      } else if (type == "raw") {
        msg = {
          $type: "regen.data.v1.MsgRegisterResolver",
          manager: sender,
          resolverId: Long.fromString(id),
          contentHashes: [
            {
              $type: "regen.data.v1.ContentHash",
              raw: {
                $type: "regen.data.v1.ContentHash.Raw",
                hash: Buffer.from(hash, "base64"),
                digestAlgorithm: 1, // DIGEST_ALGORITHM_BLAKE2B_256
                mediaType: media,
              },
            },
          ],
        }
      } else {
        setError("data type is required")
        return // exit on error
      }
    } else {
      let contentHash = ""
      try {
        contentHash = JSON.parse(json)
      } catch (err) {
        setError(err.message)
        return // exit on error
      }
      msg = MsgRegisterResolver.fromJSON({
        resolverId: Long.fromString(id),
        manager: sender,
        contentHashes: [contentHash],
      })
    }

    const bodyBytes = TxBody.encode({
      messages: [
        {
          typeUrl: `/${msg.$type}`,
          value: MsgRegisterResolver.encode(msg).finish(),
        },
      ],
      memo: "",
      timeoutHeight: "0",
      extensionOptions: [],
      nonCriticalExtensionOptions: [],
    }).finish()

    const authInfoBytes = AuthInfo.encode({
      signerInfos: [
        {
          publicKey: undefined,
          modeInfo: {
            single: {
              mode: SignMode.SIGN_MODE_DIRECT
            },
            multi: undefined,
          },
          sequence: accountSequence,
        },
      ],
      fee: {
        amount: [
          {
            denom: chainInfo.feeCurrencies[0].coinMinimalDenom,
            amount: "0",
          },
        ],
        gasLimit: "100000",
        payer: sender,
        granter: "",
      }
    }).finish()

    const signDoc: SignDoc = {
      bodyBytes,
      authInfoBytes,
      chainId: chainInfo.chainId,
      accountNumber,
    }

    window?.keplr?.signDirect(chainInfo.chainId, sender, signDoc).then(res => {

      const mode = "block" as BroadcastMode
      const signedTx = TxRaw.encode({
        bodyBytes: res.signed.bodyBytes,
        authInfoBytes: res.signed.authInfoBytes,
        signatures: [Buffer.from(res.signature.signature, "base64")],
      }).finish()

      window?.keplr?.sendTx(chainInfo.chainId, signedTx, mode).then(res => {
        setSuccess(Buffer.from(res).toString("hex"))

      }).catch(err => {
        setError("send error: " + err.message)
      })

    }).catch(err => {
      setError("sign error: " + err.message)
    })
  }

  return (
    <>
      <SelectInput
        input={input}
        setInput={setInput}
        setError={setError}
        setSuccess={setSuccess}
      />
      <div>
        {input == "form" ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <InputResolverId
              id={id}
              setId={setId}
            />
            <InputHash
              hash={hash}
              setHash={setHash}
            />
            <SelectDigestAlgorithm />
            <SelectDataType
              type={type}
              setType={setType}
            />
            {type == "graph" &&
              <>
                <SelectGraphCanon />
                <SelectGraphMerkle />
            </>
            }
            {type == "raw" &&
              <SelectRawMedia
                media={media}
                setMedia={setMedia}
              />
            }
            <button type="submit">
              {"submit"}
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <InputResolverId
              id={id}
              setId={setId}
            />
            <InputHashJSON
              json={json}
              setJson={setJson}
            />
            <button type="submit">
              {"submit"}
            </button>
          </form>
        )}
      </div>
      {error != "" && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      {success != "" && (
        <div>
          <pre>
            <a href={chainInfo.rest + queryTx + "/" + success}>
              {chainInfo.rest + queryTx + "/" + success}
            </a>
          </pre>
        </div>
      )}
    </>
  )
}

export default MsgRegisterResolverView
