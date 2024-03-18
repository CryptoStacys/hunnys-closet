@coinbase/waas-sdk-web-react
Coinbase Wallet-as-a-Service (WaaS) - Web SDK for Embedded Wallets
Coinbase's WaaS SDK lets you embed state of the art MPC wallets within web apps.

MPC wallets create a safer experience for your user by splitting risk across multiple keyshares, with key recovery and optional MFA features on signing. For more information, see our documentation on MPC.

The WaaS Web SDK allows for signing MPC transactions using your favorite web3 libraries.

2. Ways to use WaaS
There are 3 different auth and backup paradigms you can use with WaaS Web. Our recommendation is that you use Coinbase Managed User Authentication and Coinbase managed backups.

[EXPERIMENTAL] Coinbase Managed Authentication and Backups
Coinbase provides user authentication for WaaS customers as well as securely managing user wallet backups.
Currently supported authentication mechanisms:
Sign in with Google
[EXPERIMENTAL] Developer Managed Authentication w/ Coinbase Managed Backups
Your backend authenticates your user and generates Coinbase auth tokens scoped to your user.
Coinbase automatically manages the embedded wallet backups for your users.
Developer Managed Authentication and Backups
Your backend authenticates your user and generates Coinbase auth tokens scoped to your user.
You must securely manage the backup payload for your user's wallets.
NOTE: If you lose access to this backup payload, you will not be able to restore the wallet.
[EXPERIMENTAL] Coinbase Managed Authentication and Backups
Coinbase managed user authentication and backups allow for you to integrate with WaaS Web without a dedicated backend to manage user authentication or user's wallet backuups.

Reminder: Each user may only have one wallet per Coinbase Cloud project and wallets are not portable across domains.
Coinbase Managed Backups:

This functionality leverages Coinbase's encrypted cloud recovery for MPC Wallets. This feature is currently in the experimental phase and is accessible to pre-approved clients who have explicitly activated it during wallet creation by setting the enabledHostedBackups initialization option.

NOTE: Wallets created before enableHostedBackups is set to true will not be automatically backed up.


React Applications

Example provider:

return (
  <WalletProvider
    collectAndReportMetrics
    enableHostedBackups
    projectId={"<TODO: Insert `projectID` for this domain>"}
    prod={false}
  >
    {/* Your app components */}
  </WalletProvider>
);
Copy
Example component:

const { waas, user, isCreatingWallet, wallet } = useWalletContext();

// Login the user.
const handleLogin = async () => {
  await waas.login();
}

// Logout the user.
const handleLogout = async () => {
  await waas.logout();
}

// Automatically creating or restoring a wallet for a user.
useEffect(() => {
  // If the user is not yet logged in, the wallet is already loaded,
  // or the wallet is loading, do nothing.
  if (!user || wallet || isCreatingWallet) return;

  // NOTE: This will trigger a reflow of you component, and `wallet` will be set
  // to the created or restored wallet.
  if (user.hasWallet) {
    user.restoreFromHostedBackup(/* optional user-specified passcode */);
  } else {
    user.create(/* optional user-specified passcode */);
  }
}, [user, wallet, isCreatingWallet]);

if (!waas) return <div>WaaS Not Initialized</div>;

return (
  <div>
    {!user && !isLoggingIn && <button onClick={handleLogin}>Login</button>}
    {user && <p>User is logged in!</p>}
    {wallet && <p>Wallet is loaded</p>}
    {user && <button onClick={handleLogout}>Logout>/button>}
  </div>
);
Copy

Wallet Management and Security
You can leverage user-specified passcodes, when initially creating a WaaS Wallet. User-specified passcodes can be used as an additional form of security/2FA.

The passcodes must be alphanumeric and between 6 to 32 characters long.

If a user-specified passcode is set on wallet creation, that same passcode must be provided for any wallet restore or key export operations.

User-specified passcodes cannot be set after wallet creation at this time, but can be changed using the changePasscode method on a wallet.

3. Address Management
WaaS wallets utilize hierarchical deterministic (HD) derivation for its addresses, allowing for the generation of multiple addresses from a single wallet instance.

Leveraging one address per wallet.

React Applications

Prerequisite: The user is logged in and a wallet is present in the context.

const { wallet } = useWalletContext();
const address = useEVMAddress(wallet);

return (
  <div>
    {address && <p>Address exists for user's wallet</p>}
    {!address && <p>No address present</p>}
  </div>
);
Copy
Generating new addresses

React Applications

Prerequisite: The user is logged in and a wallet is present in the context.

const { wallet } = useWalletContext();
const address = useEVMAddress(wallet);

const [addresses, setAddresses] = useState<Address<IProtocolFamily>[]>([]);

// Fetch all addresses.
useEffect(() => {
  wallet.addresses.all().then(setAddresses);
}, [wallet]);

const handleCreateAddress = async () => {
  const newAddress = await wallet.createAddress(ProtocolFamily.EVM);

  setAddresses(oldAddresses => [...oldAddresses, newAddress]);
};

if (!wallet) return <div>Wallet not created/restored</div>;

return (
  <div>
    <button onClick={handleCreateAddress}>Create a new address</button>
    <ul>
      {addresses.map((address, index) => (
        <li key={index}>{address.address}</li>
      )}
    </ul>
  </div>
);
Copy
Exporting the private key for an address
Using Coinbase Managed backups
The exportKeyFromHostedBackup method on the address object allows you to export the private key for that address, given the user's optional passcode.

React Applications:

const { wallet } = useWalletContext();
const address = useEVMAddress(wallet);

const privateKeys = await address.exportKeysFromHostedBackup(passcode);
Copy

4. Signing messages and transactions
To construct transactions or sign messages, we recommend using Viem.

install the viem extension library:

npm install viem && \
npm install waas-sdk-viem.tgz
Copy
WaaS supports Viem out of the box. Simply

import { toViem } from "@coinbase/waas-sdk-viem";
Copy
and use the toViem(address) method to get a viem-compatible Account.

import { createWalletClient, http, parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { Address } from "@coinbase/waas-sdk-web";
// ...after you've created an on-chain address...
// your waas `address` can be converted to a viem account with the `toViem` helper method.
// then you’ll be able to do everything you can do with a Viem wallet: https://viem.sh/docs/actions/wallet/introduction.html
//
// Note that this requires an RPC / Node Provider.
const walletClient = createWalletClient({
  account: toViem(address),
  chain: baseSepolia,
  transport: http("TODO: url from node provider"),
});
console.log("signing a message with address " + address.address + "...");
// produce an ERC-191 signed message.
const signature = await walletClient.signMessage({
  message: "hello from waas!",
});
console.log(`Got signature: ${signature}`);
Copy
sign and send a transaction with WaaS viem extension:

// ...make sure you have sufficient fund in the address you just created
console.log("signing a transaction with address " + address.address + "...");
const res = await walletClient.sendTransaction({
  account: toViem(address),
  to: "0xabcde....", // recipient address
  value: parseEther("0.01"), // transaction amount
  // ... other transaction parameters. see: https://viem.sh/docs/accounts/signTransaction.html
});