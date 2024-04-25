import { Metadata } from 'next'

import Anchor from '@components/groups/claims/Anchor'
import Attestations from '@components/groups/claims/Attestations'
import Resolved from '@components/groups/claims/Resolved'
import Resolvers from '@components/groups/claims/Resolvers'

import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'chora groups',
}

const ClaimPage = () => (
  <div className={styles.page}>
    <div>
      <h1>{'data anchor'}</h1>
      <Anchor />
      <h1>{'data attestations'}</h1>
      <Attestations />
      <h1>{'data resolved'}</h1>
      <Resolved />
      <h1>{'data resolvers'}</h1>
      <Resolvers />
    </div>
  </div>
)

export default ClaimPage
