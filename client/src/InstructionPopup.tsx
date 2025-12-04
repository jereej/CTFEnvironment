import React from "react";

interface InstructionPopupParams {
    text: string;
    onClose: () => void;
}

const InstructionPopup: React.FC<InstructionPopupParams> = ({ text, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
            <div className="bg-white text-black max-w-xl w-full p-6 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>

                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg text-sm max-h-[300px] overflow-y-auto">
                    {text}
                </pre>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionPopup;