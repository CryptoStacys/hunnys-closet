import React from 'react';

type WaasTransactionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  transactionDetails: {
    totalCost: string;
    gasFees?: string;
    tokenId?: string;
    headline: string;
    description: string;
    // Allow image to be string or undefined
    image: string | undefined;
  };
  onConfirm: () => void;
};

const WaasTransactionModal: React.FC<WaasTransactionModalProps> = ({
  isVisible,
  onClose,
  transactionDetails,
  onConfirm,
}) => {
  if (!isVisible) return null;

  // Call onConfirm directly; the confirmation logic handled where the prop is passed down
  return (
    <div className="modalBackdrop">
      <div className="modalContent">
        <button className="closeModal" onClick={onClose}>✕</button> {/* Stylish close button */}
        <div className="transactionVisual">
          <img src={transactionDetails.image} alt="Transaction" className="transactionImage" />
          <h2>{transactionDetails.headline}</h2>
        </div>
        <p className="description">{transactionDetails.description}</p>
        <div className="costDetails">
          <p>Total cost: <span className="amount">{transactionDetails.totalCost} ETH</span></p>
          <p>Gas fees: <span className="amount">{transactionDetails.gasFees} ETH</span></p>
        </div>
        <div className="actionButtons">
          <button className="confirmBtn" onClick={onConfirm}>Confirm</button>
          <button className="cancelBtn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default WaasTransactionModal;