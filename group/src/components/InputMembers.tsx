import * as React from "react"
import { useContext } from "react"

import { WalletContext } from "chora"

import * as styles from "./InputMembers.module.css"

const choraAddressPlaceholder = "chora1jx34255cgvxpthkg572ma6rhq6crwl6xh7g0md"
const regenAddressPlaceholder = "regen1jx34255cgvxpthkg572ma6rhq6crwl6x2s4ajx"

const weightPlaceholder = "1"

const choraMetadataPlaceholder = "chora:13toVfvC2YxrrfSXWB5h2BGHiXZURsKxWUz72uDRDSPMCrYPguGUXSC.rdf"
const regenMetadataPlaceholder = "regen:13toVfvC2YxrrfSXWB5h2BGHiXZURsKxWUz72uDRDSPMCrYPguGUXSC.rdf"

const InputMembers = ({ label, members, setMembers }: any) => {

  const { network } = useContext(WalletContext)

  let addressPlaceholder: string
  let metadataPlaceholder: string
  if (network === undefined || network.includes("chora")) {
    addressPlaceholder = choraAddressPlaceholder
    metadataPlaceholder = choraMetadataPlaceholder
  } else {
    addressPlaceholder = regenAddressPlaceholder
    metadataPlaceholder = regenMetadataPlaceholder
  }

  const handleChange = (i, prop, event) => {
    let m = members[i]
    m[prop] = event.target.value

    let ms = [...members]
    ms[i] = m

    setMembers(ms)
  }

  const handleAddMember = (event) => {
    event?.preventDefault()

    let ms = [...members]
    ms.push({address: "", weight: "", metadata: ""})

    setMembers(ms)
  }

  const handleRemoveMember = (event) => {
    event?.preventDefault()

    if (members.length > 0) {
      let ms = [...members]
      ms.pop()

      setMembers(ms)
    }
  }

  return (
    <>
      {members.length > 0 && members.map((m, i) => (
        <span className={styles.member} key={i}>
          {label ? label + " " + (i+1) : "member " + (i+1)}
          <label htmlFor="address">
            {"member address"}
            <input
              id="member-address"
              value={m.address}
              placeholder={addressPlaceholder}
              onChange={event => handleChange(i, "address", event)}
            />
          </label>
          <label htmlFor="weight">
            {"member weight"}
            <input
              id="member-weight"
              value={m.weight}
              placeholder={weightPlaceholder}
              onChange={event => handleChange(i, "weight", event)}
            />
          </label>
          <label htmlFor="metadata">
            {"member metadata"}
            <input
              id="member-metadata"
              value={m.metadata}
              placeholder={metadataPlaceholder}
              onChange={event => handleChange(i, "metadata", event)}
            />
          </label>
        </span>
      ))}
      <span className={styles.options}>
        <button onClick={handleAddMember}>
          {label ? "add " + label : "add member"}
        </button>
        {members.length > 0 && (
          <button onClick={handleRemoveMember}>
          {label ? "remove " + label : "remove member"}
          </button>
        )}
      </span>
    </>
  )
}

export default InputMembers
