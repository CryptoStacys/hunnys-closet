import { BigNumber } from "ethers";
import React, { useEffect, useRef } from 'react';
import CoinbaseButtonPolygon from "../Wallet/CoinbaseButtonPolygon";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";

type WaasTransactionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  transactionDetails: {
    totalCost: string;
    mintPrice: BigNumber;
    gasFees?: string;
    tokenId?: string;
    attribute?: string;
    headline: string;
    description: string;
    // Allow image to be string or undefined
    image?: string | undefined;
  };
  onConfirm: () => void;
};

const WaasTransactionModal: React.FC<WaasTransactionModalProps> = ({
  isVisible,
  onClose,
  transactionDetails,
  onConfirm,
}) => {
  const [user] = useAtom(userAtom);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isVisible]);

  if (!isVisible || !transactionDetails) return null;

  // Call onConfirm directly; the confirmation logic handled where the prop is passed down
  return (
    <div className="modalBackdrop" tabIndex={-1} ref={modalRef}>
      <div className="modalContent font-poppins font-bold">
        <button className="closeModal" onClick={onClose}>
          ✕
        </button>{" "}
        {/* Stylish close button */}
        <div className="transactionVisual">
          <img
            src={transactionDetails.image}
            alt="Transaction"
            className="transactionImage"
          />
          <h2>{transactionDetails.headline}</h2>
        </div>
        {transactionDetails.attribute &&
        <h2>Attribute: {transactionDetails.attribute}</h2>
      }
        {/* <p className="description font-extralight">{transactionDetails.description}</p> */}
        <div className="costDetails">
          <p>
            Cost:{" "}
            <span className="amount">{transactionDetails.totalCost} ETH</span>
          </p>
        </div>
        <div className="actionButtons">
          <button
            className="bg-hunnys-yellow py-1 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
            onClick={onConfirm}
          >
            CONFIRM PURCHASE
          </button>
          <button className="mt-8" onClick={onClose}>
            Cancel
          </button>
              <div className="border-t-2 border-gray-200 my-8"></div>
          <div className="text-center self-center mt-8 font-thin">
            <p>Add funds with</p>
          <CoinbaseButtonPolygon
            destinationWalletAddress={user?.address || ""}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default WaasTransactionModal;
