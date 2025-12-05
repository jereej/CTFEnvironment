import React from "react";

interface InstructionPopupParams {
  text: string;

  // Always required
  onClose: () => void;

  // Optional confirm mode
  buttonText?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const InstructionPopup: React.FC<InstructionPopupParams> = ({
  text,
  buttonText,
  onClose,
  confirmText,
  cancelText,
  onConfirm,
}) => {
  const isConfirmMode = Boolean(confirmText && cancelText && onConfirm);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white text-black max-w-xl w-full p-6 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {isConfirmMode ? "Confirm Action" : "Instructions"}
        </h2>

        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg text-sm max-h-[300px] overflow-y-auto">
          {text}
        </pre>

        <div className="flex justify-end gap-3 mt-4">
          {isConfirmMode ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {buttonText || "Understood"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructionPopup;