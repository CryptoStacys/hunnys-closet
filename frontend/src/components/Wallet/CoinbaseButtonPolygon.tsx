import React, { useEffect, useRef, useState } from 'react';
import type { CBPayInstanceType, InitOnRampParams } from '@coinbase/cbpay-js';
import { initOnRamp } from '@coinbase/cbpay-js';

interface CoinbaseButtonPolygonProps {
  destinationWalletAddress: string;
}

const CoinbaseButtonPolygon: React.FC<CoinbaseButtonPolygonProps> = ({ destinationWalletAddress }) => {
  const [isReady, setIsReady] = useState(false);
  const [onrampInstance, setOnrampInstance] = useState<CBPayInstanceType | undefined>();

  useEffect(() => {
    initOnRamp({
      appId: 'bfe2f881-605a-40cc-a464-c0a0866bd0e4',
      target: '#cbpay-button-container',
      widgetParameters: {
        destinationWallets: [{
          address: destinationWalletAddress,
          blockchains: ['polygon'],
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
    <button id="cbpay-button-container" onClick={handleClick} className="cursor-pointer">
      <img src="./icons/cbpay/56px/button-cbPay-normal-generic.png" alt="Buy with Coinbase" />
    </button>
  );
};

export default CoinbaseButtonPolygon;
