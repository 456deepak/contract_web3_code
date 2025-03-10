import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWalletAddress } from 'gamba-react-v2'
import { GambaUi } from 'gamba-react-ui-v2'
import React from 'react'
import { Modal } from '../components/Modal'
import { truncateString } from '../utils'
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

function ConnectedButton() {
  const [modal, setModal] = React.useState(false)
  const wallet = useWallet()
  const ref = React.useRef<HTMLDivElement>(null!)
  const address = useWalletAddress()

  return (
    <>
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <h1>
            {truncateString(address.toBase58(), 6, 3)}
          </h1>
          <GambaUi.Button onClick={() => wallet.disconnect()}>
            Disconnect
          </GambaUi.Button>
        </Modal>
      )}
      <div style={{ position: 'relative' }} ref={ref}>
        <GambaUi.Button
          onClick={() => setModal(true)}
        >
          <div style={{display: 'flex', gap: '.5em', alignItems: 'center'}}>
            <img src={wallet.wallet?.adapter.icon} height="20px" />
            {truncateString(address.toBase58(), 3)}
          </div>
        </GambaUi.Button>
      </div>
    </>
  )
}

export function UserButton() {
  const walletModal = useWalletModal()
  const wallet = useWallet()

  const connect = async () => {
    try {
      const ledgerAdapter = new LedgerWalletAdapter()
      await ledgerAdapter.connect()
    } catch (error) {
      console.error("Ledger connection failed:", error)
      return null
    }
  }

  return (
    <>
      {wallet.connected ? <ConnectedButton /> : (
        <GambaUi.Button onClick={connect}>
          {wallet.connecting ? 'Connecting' : 'Connect'}
        </GambaUi.Button>
      )}
    </>
  )
}
