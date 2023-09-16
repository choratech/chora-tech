import * as React from "react"
import { useContext, useEffect, useState } from "react"
import { Link } from "gatsby"

import { WalletContext } from "chora"
import { useCoopParams } from "../../hooks/coop"

import { Result } from "chora/components"

import * as styles from "./VoucherPreview.module.css"

const queryPolicy = "cosmos/group/v1/group_policy_info"

const VoucherPreview = ({ voucher }) => {

  const { chainInfo, network } = useContext(WalletContext)

  const [groupId, serverUrl] = useCoopParams(chainInfo)

  // fetch error and results
  const [error, setError] = useState<string | undefined>(undefined)
  const [metadata, setMetadata] = useState<any>(undefined)
  const [issuer, setIssuer] = useState<any>(undefined)

  // reset state on node or network change
  useEffect(() => {
    setError(undefined)
    setMetadata(undefined)
    setIssuer(undefined)
  }, [voucher, chainInfo?.chainId]);

  // fetch on load and group or voucher metadata change
  useEffect(() => {

    // fetch voucher metadata from data provider
    if (groupId && voucher?.metadata) {
      fetchMetadata().catch(err => {
        setError(err.message)
      })
    }
  }, [groupId, voucher?.metadata])

  // fetch on load and group or voucher issuer change
  useEffect(() => {

    // fetch voucher issuer from selected network and data provider
    if (groupId && voucher?.issuer) {
      fetchVoucherIssuer().catch(err => {
        setError(err.message)
      })
    }
  }, [groupId, voucher?.issuer])

  // fetch metadata
  const fetchMetadata = async () => {

    // fetch voucher metadata from data provider
    await fetch(serverUrl + "/data/" + voucher["metadata"])
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setError(res.error)
          setMetadata(null)
        } else {
          const data = JSON.parse(res["jsonld"])
          if (data["@context"] !== "https://schema.chora.io/contexts/voucher.jsonld") {
            setError("unsupported metadata schema")
            setMetadata(null)
          } else {
            setError("")
            setMetadata(data)
          }
        }
      })
      .catch(err => {
        setError(err.message)
      })
  }

  // fetch voucher issuer
  const fetchVoucherIssuer = async () => {

    let iri: string

   // fetch policy from selected network
    await fetch(chainInfo.rest + "/" + queryPolicy + "/" + voucher["issuer"])
        .then(res => res.json())
        .then(res => {
          if (res.code) {
            setError(res.message)
          } else {
            iri = res["info"]["metadata"]
          }
        })

    // fetch member metadata from data provider
    await fetch(serverUrl + "/data/" + iri)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setError(res.error)
        } else {
          const data = JSON.parse(res["jsonld"])
          if (data["@context"] !== "https://schema.chora.io/contexts/group_policy.jsonld") {
            setError("unsupported metadata schema")
          } else {
            setError("")
            setIssuer({
              address: voucher["issuer"],
              name: data["name"]
            })
          }
        }
      })
      .catch(err => {
        setError(err.message)
      })
  }

  return (
    <div className={styles.boxItem}>
      <div className={styles.boxText}>
        <h3>
          {"name"}
        </h3>
        <p>
          {metadata && metadata["name"] ? metadata["name"] : "NA"}
        </p>
      </div>
      <div className={styles.boxText}>
        <h3>
          {"issuer"}
        </h3>
        {issuer ? (
          <p>
            {`${issuer["name"]} (`}
              <Link to={`/policies/?address=${issuer["address"]}`}>
                {issuer["address"]}
              </Link>
            {")"}
          </p>
        ) : (
          <p>
            {voucher["issuer"]}
          </p>
        )}
      </div>
      <Link to={`/vouchers/?id=${voucher["id"]}`}>
        {"view voucher"}
      </Link>
      {error && (
        <div className={styles.boxText}>
          <Result error={error} />
        </div>
      )}
    </div>
  )
}

export default VoucherPreview
