'use client'

import * as React from 'react'
import { useContext } from 'react'

import { WalletContext } from '../../contexts'

import styles from './ResolversTableRow.module.css'

const ResolversTableRow = ({ resolver, renderAddress, renderLink }: any) => {
  const { wallet } = useContext(WalletContext)

  return (
    <tr>
      <td>{resolver.id}</td>
      <td>{resolver.url}</td>
      {renderAddress ? (
        <td>{renderAddress(resolver.manager)}</td>
      ) : (
        <td>
          {resolver.manager.substring(0, 13) +
            '...' +
            resolver.manager.substring(38, 44)}
          {wallet && resolver.manager === wallet.bech32Address && (
            <span className={styles.activeAccount}>{'(active account)'}</span>
          )}
        </td>
      )}
      <td style={{ minWidth: '120px' }}>
        {renderLink && renderLink(resolver.id)}
      </td>
    </tr>
  )
}

export default ResolversTableRow
