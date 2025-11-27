import React, { useState } from "react";
import data from "./mails.json";

interface Mail {
    id: number;
    header: string;
    sender: string;
    recipient: string;
    content: string;
    isSuspicious: boolean;
}

const Mail: React.FC = () => {
    const mails: Mail[] = data.mails;
    const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
    const [answers, setAnswers] = useState<Record<number, boolean>>({});


    const markSuspiciousity = (mailId: number, guess: boolean) => {
        setAnswers(prev => ({ ...prev, [mailId]: guess }));
    };

    const checkResults = () => {
    let correct = 0;
    let total = mails.length;

    mails.forEach(mail => {
        const userAnswer = answers[mail.id];
        if (userAnswer === mail.isSuspicious) {
            correct++;
        }
    });

    const percentage = (correct / total) * 100;
    alert(`Correct: ${correct}/${total} (${percentage.toFixed(1)}%)`);
    };

    const allMarked = Object.keys(answers).length === mails.length;

    return (
        <div className="absolute inset-0 bg-[#1C1C1DFF]">
            <div className="absolute inset-0 min-h-screen w-full bg-[url('/mail.png')] bg-contain bg-center bg-no-repeat">
                <div
                    className="
                        absolute
                        left-[324px]               
                        top-[56px]                        
                        flex
                        w-[1274px]
                        h-[635px]
                        bg-[#1C1C1DFF]
                        shadow-2xl
                        overflow-hidden
                        border border-gray-700
                    "
                >
                    <div className="w-1/3 border-r border-gray-700 flex flex-col">
                        <h1 className="text-2xl text-white p-4 border-b border-gray-700 flex-shrink-0">
                            BaguetteMail🥖
                        </h1>

                        <div className="flex-1 overflow-y-auto">
                            {mails.map((mail) => (
                                <div
                                    key={mail.id}
                                    onClick={() => setSelectedMail(mail)}
                                    className={`
                                        cursor-pointer p-4 border-b border-gray-700 hover:bg-gray-800
                                        ${selectedMail?.id === mail.id ? "bg-gray-700" : ""}
                                    `}
                                >
                                    <h2 className="text-white font-semibold">{mail.header}</h2>
                                    <p className="text-gray-400 text-sm">
                                        {mail.sender} - {mail.content.slice(0, 50)}...
                                    </p>
                                </div>
                            ))}
                            {allMarked && (
                                <div className="flex justify-center py-4">
                                    <button
                                        onClick={checkResults}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    >
                                        Check Results
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-2/3 p-6 overflow-y-auto flex flex-col">

                        {selectedMail ? (
                            <>
                                {/* CONTENT BOX */}
                                <div className="bg-gray-900 text-white rounded-lg p-6 shadow-inner">
                                    <h2 className="text-2xl font-bold mb-2">{selectedMail.header}</h2>

                                    <p className="text-gray-400 mb-1">
                                        <strong>From:</strong> {selectedMail.sender}
                                    </p>

                                    <p className="text-gray-400 mb-4">
                                        <strong>To:</strong> {selectedMail.recipient}
                                    </p>

                                    <p className="mb-6">{selectedMail.content}</p>
                                </div>

                                {answers[selectedMail.id] !== undefined ? (
                                    <div className="mt-4 text-yellow-400 font-semibold">
                                        Mail has already been marked
                                    </div>
                                ) : (
                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={() => markSuspiciousity(selectedMail.id, true)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                                        >
                                            Mark as suspicious
                                        </button>

                                        <button
                                            onClick={() => markSuspiciousity(selectedMail.id, false)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                                        >
                                            Mark as not suspicious
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-1 text-gray-400 text-xl p-4">
                                Select a mail to read
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mail;
