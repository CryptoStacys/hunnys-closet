import React, { useEffect, useRef, useState } from 'react';
import type { CBPayInstanceType, InitOnRampParams } from '@coinbase/cbpay-js';
import { initOnRamp } from '@coinbase/cbpay-js';

interface CoinbaseButtonEthProps {
  destinationWalletAddress: string;
}

const CoinbaseButtonEth: React.FC<CoinbaseButtonEthProps> = ({ destinationWalletAddress }) => {
  const [isReady, setIsReady] = useState(false);
  const [onrampInstance, setOnrampInstance] = useState<CBPayInstanceType | undefined>();

  useEffect(() => {
    initOnRamp({
      appId: 'bfe2f881-605a-40cc-a464-c0a0866bd0e4',
      target: '#cbpay-button-container',
      widgetParameters: {
        destinationWallets: [{
          address: destinationWalletAddress,
          blockchains: ['ethereum'],
        }],
        presetCryptoAmount: 0.01, // Specify preset crypto amount here
      },
      onSuccess: () => {
        console.log('success');
      },
      onExit: () => {
        console.log('exit');
      },
      onEvent: (event) => {
        console.log('event', event);
      },
      experienceLoggedIn: 'popup',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true,
    }, (_, instance) => {
      setOnrampInstance(instance!);
    });

    return () => {
      onrampInstance?.destroy();
    };
  }, []);

  const handleClick = () => {
    onrampInstance?.open();
  };

  return (
    <><button id="cbpay-button-container" onClick={handleClick} className="cursor-pointer mobile-hide">
      <img src="./icons/cbpay/40px/button-cbPay-compact-generic.png" alt="Buy with Coinbase" />
    </button><button id="cbpay-button-container" onClick={handleClick} className="cursor-pointer md:hidden">
        <img src="./icons/cbpay/40px/button-cbPay-compact-generic-condensed.png" alt="Buy with Coinbase" />
      </button></>
  );
};

export default CoinbaseButtonEth;
