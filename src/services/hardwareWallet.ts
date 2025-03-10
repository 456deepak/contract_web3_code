import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import EthAppLedger from '@ledgerhq/hw-app-eth';
import TrezorConnect from '@trezor/connect-web';


export async function connectLedger() {
  if (!navigator.usb) {
    throw new Error('WebUSB is not supported in this browser. Please use Chrome, Edge, or Opera.');
  }

  try {
    const transport = await TransportWebUSB.create();
    const ethApp = new EthAppLedger(transport);
    const result = await ethApp.getAddress("44'/60'/0'/0/0");
    console.log("Ledger Address:", result.address);
    await transport.close();
    return {
      address: result.address,
      type: 'ledger'
    };
  } catch (error) {
    console.error("Ledger connection failed:", error);
    throw error;
  }
}

export async function connectTrezor() {
  if (!window.usb) {
    throw new Error('USB support is required. Please use a modern browser.');
  }

  try {
    await TrezorConnect.init({
      lazyLoad: true,
      manifest: {
        email: 'developer@yourdomain.com',
        appUrl: 'https://yourdomain.com'
      }
    });
    const result = await TrezorConnect.ethereumGetAddress({
      path: "m/44'/60'/0'/0/0",
      showOnTrezor: true
    });

    if (result.success) {
      console.log("Trezor Address:", result.payload.address);
      return {
        address: result.payload.address,
        type: 'trezor'
      };
    } else {
      throw new Error(result.payload.error);
    }
  } catch (error) {
    console.error("Trezor error:", error);
    throw error;
  }
} 