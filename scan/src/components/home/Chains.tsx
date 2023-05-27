import * as React from "react"

import Chain from "./Chain"

import * as styles from "./Chains.module.css"

import {
  choraLocal,
  choraTestnet,
  regenLocal,
  regenMainnet,
  regenRedwood,
} from "chora/utils/chains"

const Chains = () => {
  let local: boolean
  if (typeof window !== "undefined" && (
      window.location.hostname == "0.0.0.0" ||
      window.location.hostname == "127.0.0.1" ||
      window.location.hostname == "localhost"
    )
  ) { local = true }

  return (
    <div className={styles.box}>
      <div>
        <h2>
          {"blockchain networks"}
        </h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>
                {"chain id"}
              </td>
              <td>
                {"latest block date"}
              </td>
              <td>
                {"latest block time"}
              </td>
              <td>
                {"latest block height"}
              </td>
              <td>
                {"dashboard"}
              </td>
            </tr>
          </thead>
          <tbody>
            {local && (
              <Chain
                chainInfo={choraLocal}
                dashboardUrl={`/${choraLocal.chainId}`}
              />
            )}
            <Chain
              chainInfo={choraTestnet}
              dashboardUrl={`/${choraTestnet.chainId}`}
            />
            <Chain
              chainInfo={regenMainnet}
              dashboardUrl={`/${regenMainnet.chainId}`}
            />
            {local && (
              <Chain
                chainInfo={regenLocal}
                dashboardUrl={`/${regenLocal.chainId}`}
              />
            )}
            <Chain
              chainInfo={regenRedwood}
              dashboardUrl={`/${regenRedwood.chainId}`}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Chains
