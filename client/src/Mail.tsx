import React, { JSX, useState } from "react";
import data from "./jsons/mails.json";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import InstructionPopup from "./InstructionPopup";

interface Mail {
    id: number;
    header: string;
    sender: string;
    recipient: string;
    content: string;
    date: string;
    time: string;
    isSuspicious: boolean;
    explanation: string;
}

const Mail: React.FC = () => {
    const mails: Mail[] = data.mails;
    const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
    const [answers, setAnswers] = useState<Record<number, boolean>>({});
    const [canShowExplanations, setCanShowExplanations] = useState(false);
    const [showExplanationForMail, setShowExplanationForMail] = useState<Record<number, boolean>>({});
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [resultText, setResultText] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [instructionModalOpen, setInstructionModalOpen] = useState(true);

    const instructions = 
`Welcome to the Mail inspection task.

In this task you are asked to read all six of the emails in the inbox and then mark them as suspicious or not suspicious.

After marking all emails, you can check your results by clicking on the "Check Results" button under the last mail.

After that, you can see the explanations for each mail, explaining why the given mail is suspicous or not.
`;


    const markSuspiciousity = (mailId: number, guess: boolean) => {
        setAnswers(prev => ({ ...prev, [mailId]: guess }));
    };

    const checkResults = () => {
        setCanShowExplanations(true);
        let correct = 0;
        let total = mails.length;
        let msg = "";

        mails.forEach(mail => {
            const userAnswer = answers[mail.id];
            if (userAnswer === mail.isSuspicious) correct++;
        });

        const percentage = (correct / total) * 100;

        if (correct === total) {
            msg += `Perfect score! ${correct}/${total} correct!\n\n`;
            msg += `Here's a flag for you:\nBAGUETTE{task2_tempflag}\n\n`;

            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        } else {
            msg += `Correct: ${correct}/${total} (${percentage.toFixed(1)}%)\n\n`;
        }

        msg += `You can check the explanations by clicking "Show explanation" under each mail.`;

        setResultText(msg);
        setResultModalOpen(true);
    };
        

    const allMarked = Object.keys(answers).length === mails.length;

    function linkify(text: string): (string | JSX.Element)[] {
        // Markdown link: [text](http(s)://...)
        const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

        // Raw URL: http://... or https://...
        const rawUrlRegex = /(https?:\/\/[^\s]+)/g;

        // Combined pattern
        const combined = new RegExp(`${mdLinkRegex.source}|${rawUrlRegex.source}`, "g");

        const pieces: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = combined.exec(text)) !== null) {
            const fullMatch = match[0];

            // Push plain text before match
            if (match.index > lastIndex) {
            pieces.push(text.slice(lastIndex, match.index));
            }

            // Markdown link matched
            if (match[2]) {
            const linkText = match[1];
            const url = match[2];

            pieces.push(
                <a
                key={`md-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
                >
                {linkText}
                </a>
            );
            }
            // Raw URL matched
            else if (match[0].startsWith("http")) {
            const url = match[0];

            pieces.push(
                <a
                key={`raw-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
                >
                {url}
                </a>
            );
            }

            lastIndex = match.index + fullMatch.length;
        }

        // Push remaining text
        if (lastIndex < text.length) {
            pieces.push(text.slice(lastIndex));
        }

        // Convert \n to <br/>
        const withBreaks = pieces.flatMap((part, i) => {
            if (typeof part !== "string") return [part];

            const lines = part.split("\n");
            return lines.flatMap((line, j) =>
            j < lines.length - 1
                ? [line, <br key={`br-${i}-${j}`} />]
                : [line]
            );
        });

        return withBreaks;
    }

    return (
        <div className="absolute inset-0 bg-[#1C1C1DFF]">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={500}
                    recycle={false}
                />
            )}
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
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <Link to="/backrooms">
                                <button className="text-white">
                                    &lt; Back
                                </button>
                            </Link>
                            <h1 className="text-2xl text-white">
                                BaguetteMail🥖
                            </h1>
                        </div>

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
                                    <h2 className="text-white font-bold">{mail.header.slice(0,30)}...</h2>
                                    <p className="text-gray-300 text-sm">{mail.sender}</p>
                                    <p className="text-gray-400 text-sm">
                                        {mail.content.slice(0, 50)}...
                                        <br/>{mail.date} {mail.time}
                                    </p>
                                </div>
                            ))}
                            {allMarked && (
                                <div className="flex flex-col items-center py-4 gap-2">
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

                                    <p className="text-gray-400">
                                        <strong>From:</strong> {selectedMail.sender}
                                    </p>

                                    <p className="text-gray-400 mb-2">
                                        <strong>To:</strong> {selectedMail.recipient}
                                    </p>
                                    <p className="text-gray-400 mb-3">
                                        {selectedMail.date} {selectedMail.time}
                                    </p>

                                    <div className="mb-6">
                                        {linkify(selectedMail.content)}
                                    </div>
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

                                {/* EXPLANATION (only if results checked) */}
                                {canShowExplanations && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() =>
                                                setShowExplanationForMail(prev => ({
                                                    ...prev,
                                                    [selectedMail.id]: !prev[selectedMail.id]
                                                }))
                                            }
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                                        >
                                            {showExplanationForMail[selectedMail.id]
                                                ? "Hide Explanation"
                                                : "Show Explanation"}
                                        </button>

                                        {showExplanationForMail[selectedMail.id] && (
                                            <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                                                <h3 className="text-white-xl font-semibold mb-2">Explanation</h3>
                                                <p className="text-gray-300 whitespace-pre-line">
                                                    {linkify(selectedMail.explanation)}
                                                </p>
                                            </div>
                                        )}
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
            {resultModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
                    <div className="bg-white text-black max-w-xl w-full p-6 rounded-xl shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Results</h2>

                        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg text-sm max-h-[300px] overflow-y-auto">
                            {resultText}
                        </pre>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setResultModalOpen(false)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

                {instructionModalOpen && (
                    <InstructionPopup
                    text={instructions}
                    onClose={() => setInstructionModalOpen(false)}
                    ></InstructionPopup>
                )}
        </div>
    );
};

export default Mail;
