import React from 'react'
import styled from 'styled-components'
import { SelectableButton } from './index'
import { connectLedger, connectTrezor } from '../services/hardwareWallet'

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`

const WalletButton = styled(SelectableButton)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  
  img {
    width: 24px;
    height: 24px;
  }
`

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 10px;
  margin: 5px 0;
  font-size: 14px;
  text-align: center;
`

const StatusMessage = styled.div`
  color: #44ff44;
  padding: 10px;
  margin: 5px 0;
  font-size: 14px;
  text-align: center;
`

interface HardwareWallet {
  name: string;
  icon: string;
  connect: () => Promise<{ address: string; type: string; } | null>;
}

export function HardwareWalletConnect() {
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [connecting, setConnecting] = React.useState(false);
  const [connectedAddress, setConnectedAddress] = React.useState<string | null>(null);

  const HARDWARE_WALLETS: HardwareWallet[] = [
    {
      name: 'Ledger',
      icon: '/ledger-icon.png',
      connect: connectLedger
    },
    {
      name: 'Trezor',
      icon: '/trezor-icon.png',
      connect: connectTrezor
    }
  ];

  const handleConnect = async (wallet: HardwareWallet) => {
    setError(null);
    setStatus(`Connecting to ${wallet.name}...`);
    setConnecting(true);

    try {
      const result = await wallet.connect();
      if (result?.address) {
        setConnectedAddress(result.address);
        setStatus(`Connected to ${wallet.name}: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`);
      } else {
        setError(`Failed to connect to ${wallet.name}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <WalletList>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {status && <StatusMessage>{status}</StatusMessage>}
      {HARDWARE_WALLETS.map((wallet) => (
        <WalletButton 
          key={wallet.name}
          onClick={() => handleConnect(wallet)}
          disabled={connecting}
          selected={connectedAddress !== null}
        >
          <img src={wallet.icon} alt={wallet.name} />
          {wallet.name}
          {connecting && ' (Connecting...)'}
        </WalletButton>
      ))}
    </WalletList>
  )
}