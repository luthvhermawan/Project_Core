// components/PaymentModal.tsx
import React from 'react';

interface PaymentModalProps {
  method: string;
  amount: number;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ method, amount, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-black text-center relative">
        <h2 className="text-xl font-bold mb-4">Silakan Bayar</h2>
        <p className="mb-2">Gunakan <strong>{method.toUpperCase()}</strong></p>
        <p className="mb-4 text-lg font-semibold text-green-600">Rp {amount.toLocaleString()}</p>
        <button
          className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 rounded font-semibold"
          onClick={onClose}
        >
          Sudah Bayar
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
