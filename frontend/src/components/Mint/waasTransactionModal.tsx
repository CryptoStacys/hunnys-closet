import { BigNumber, ethers } from "ethers";
import React, { useState, useEffect, useCallback, useRef } from "react";
import CoinbaseButtonPolygon from "../Wallet/CoinbaseButtonPolygon";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import { fetchBalances } from "../../utils/fetchBalances";

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
  const [polygonBalance, setPolygonBalance] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

useEffect(() => {
    const updateBalances = async () => {
      if (user?.address) {
        const { polygonBalance } = await fetchBalances(user.address);
        setPolygonBalance(polygonBalance);

        // Convert totalCost and polygonBalance to BigNumber for comparison
        const totalCostBigNumber = ethers.utils.parseEther(transactionDetails.totalCost);
        const polygonBalanceBigNumber = ethers.utils.parseEther(polygonBalance);

        // Update button disabled state based on balance sufficiency
        setIsButtonDisabled(polygonBalanceBigNumber.lt(totalCostBigNumber));
      }
    };

    updateBalances();
  }, [user?.address, transactionDetails.totalCost]);

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
            <span className="amount">Ξ{transactionDetails.totalCost}</span>
          </p>
        </div>
        <div className="actionButtons">
        <button
            className={`bg-hunnys-yellow py-1 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onConfirm}
            disabled={isButtonDisabled} // Disable based on balance check
          >
            CONFIRM PURCHASE
          </button>
          <button className="mt-8" onClick={onClose}>
            Cancel
          </button>
              <div className="border-t-2 border-gray-200 my-8"></div>
              <div className="costDetails">
        <p>
            Current Balance:{" "}
            <span className="amount">Ξ{polygonBalance.substring(0, 6)}</span>
          </p>
        </div>
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
