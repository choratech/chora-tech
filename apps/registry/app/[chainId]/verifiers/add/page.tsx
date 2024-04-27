import { Breadcrumb } from 'chora/components'
import { Metadata } from 'next'

import AddVerifier from '@components/verifiers/AddVerifier'

import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'chora registry',
}

const AddPage = () => (
  <div className={styles.page}>
    <div>
      <Breadcrumb text="← verifiers" />
      <h1>{'add verifier'}</h1>
      <AddVerifier />
    </div>
  </div>
)

export default AddPage
