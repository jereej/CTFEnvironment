import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "./config";
import taskStories from "./jsons/taskStories.json";
import { Link } from "react-router-dom";
import InstructionPopup from "./InstructionPopup";

type Progress = {
  task1_done: boolean;
  task2_done: boolean;
  task3_done: boolean;
  task4_done: boolean;
};

const SubmitFlags: React.FC = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [inputs, setInputs] = useState({1: "", 2: "", 3: "", 4: ""});
  const [errors, setErrors] = useState({1: "", 2: "", 3: "", 4: ""});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const sessionId = localStorage.getItem("ctf_session_id");

  // Load current task progress
  useEffect(() => {
    if (!sessionId) return;

    axios
      .get(`${API_BASE}progress/get/${sessionId}/`)
      .then((res) => setProgress(res.data))
      .catch((err) => console.error("Failed to load progress", err));
  }, [sessionId]);

  const submitFlag = async (taskId: number) => {
    if (!sessionId) return;

    try {
      await axios.post(`${API_BASE}tasks/`, {
        session_id: sessionId,
        task_id: taskId,
        flag: inputs[taskId as 1 | 2 | 3 | 4]
      });

      // Clear error for that task
      setErrors(prev => ({ ...prev, [taskId]: "" }));

      // Mark as completed
      setProgress(prev =>
        prev ? { ...prev, [`task${taskId}_done`]: true } as Progress : prev
      );

    } catch {
      // Set error for that specific task box
      setErrors(prev => ({
        ...prev,
        [taskId]: "Invalid flag. Try again."
      }));
    }
  };

  const resetProgress = async () => {
    if (!sessionId) return;

    try {
      await axios.post(`${API_BASE}progress/reset/${sessionId}/`);

      setProgress({
        task1_done: false,
        task2_done: false,
        task3_done: false,
        task4_done: false,
      });

      setInputs({ 1: "", 2: "", 3: "", 4: "" });
      setErrors({ 1: "", 2: "", 3: "", 4: "" });

    } catch (err) {
      console.error("Failed to reset progress", err);
    }
  };

  if (!progress) return <p>Loading...</p>;

  const taskNames: Record<1 | 2 | 3 | 4, string> = {
    1: "Task 1 — The Wild World of Password Security",
    2: "Task 2 — Rise of the Crusty Emails",
    3: "Task 3 — Remains to be Seen",
    4: "Task 4 — Physical Security Task",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-8">Submit Your Flags</h1>
      <Link to="/">
        <button
          className="mb-8 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-semibold"
        >
          ← Return to Home
        </button>
      </Link>
      <div className="grid grid-cols-1 gap-6">
        {([1, 2, 3, 4] as const).map((taskId) => {
          const done = progress[`task${taskId}_done` as keyof Progress];
          return (
            <div
                key={taskId}
                className={`p-4 rounded-xl border-4 ${
                    done ? "border-green-500" : "border-red-500"
                }`}
                >
                <h2 className="text-xl font-semibold mb-2">
                    {taskNames[taskId]}
                </h2>

                {done ? (
                    <div className="mt-3 text-left bg-green-50 p-3 rounded-lg shadow-inner">
                    <p className="text-green-700 font-bold mb-2">✔ Completed</p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {(taskStories as any)[taskId]}
                    </p>
                    </div>
                ) : (
                    <>
                    <input
                        type="text"
                        value={inputs[taskId]}
                        onChange={(e) =>
                        setInputs({ ...inputs, [taskId]: e.target.value })
                        }
                        placeholder="Enter flag: BAGUETTE{...}"
                        className="w-full p-2 border rounded mb-3"
                    />

                    <button
                        onClick={() => submitFlag(taskId)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Submit Flag
                    </button>

                    {errors[taskId] && (
                        <p className="text-red-600 font-semibold mt-2">{errors[taskId]}</p>
                    )}
                    </>
                )}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => setShowResetConfirm(true)}
        className="
          fixed bottom-6 right-6
          px-5 py-3
          bg-red-600 hover:bg-red-700
          text-white font-semibold
          rounded-xl shadow-xl
          transition
          z-50
        "
      >
        Reset Progress
      </button>
      {showResetConfirm && (
        <InstructionPopup
          text="Are you sure you want to reset your progress? This cannot be undone."
          cancelText="Cancel"
          confirmText="Yes, Reset"
          onClose={() => setShowResetConfirm(false)}
          onConfirm={async () => {
            setShowResetConfirm(false);
            await resetProgress();
          }}
        />
      )}
    </div>
  );
}

export default SubmitFlags;
