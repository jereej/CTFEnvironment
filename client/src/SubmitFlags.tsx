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
  task5_done: boolean;
};

const SubmitFlags: React.FC = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [inputs, setInputs] = useState({1: "", 2: "", 3: "", 4: "", 5: ""});
  const [errors, setErrors] = useState({1: "", 2: "", 3: "", 4: "", 5: ""});
  const [showTask5UnlockEffect, setShowTask5UnlockEffect] = useState(false);
  const [showTask5UnlockPopup, setShowTask5UnlockPopup] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const sessionId = localStorage.getItem("ctf_session_id");
  const canShowTask5 = progress &&
    progress.task1_done &&
    progress.task2_done &&
    progress.task3_done &&
    progress.task4_done;

  useEffect(() => {
    if (!canShowTask5 || !sessionId) return;

    const alreadyUnlocked = sessionStorage.getItem(
      `task5_unlocked_${sessionId}`
    );

    if (!alreadyUnlocked) {
      setShowTask5UnlockEffect(true);
      setShowTask5UnlockPopup(true);

      axios.post(`${API_BASE}disaster/`, {
        session_id: sessionId,
      }).catch(() => {
        console.warn("Disaster trigger failed (safe to ignore)");
      });

      sessionStorage.setItem(`task5_unlocked_${sessionId}`, "true");

      setTimeout(() => {
        setShowTask5UnlockEffect(false);
      }, 3000);
    }
  }, [canShowTask5, sessionId]);

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
        flag: inputs[taskId as 1 | 2 | 3 | 4 | 5],
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
        task5_done: false,
      });

      setInputs({ 1: "", 2: "", 3: "", 4: "", 5: ""});
      setErrors({ 1: "", 2: "", 3: "", 4: "", 5: ""});
      sessionStorage.removeItem(`task5_unlocked_${sessionId}`);

    } catch (err) {
      console.error("Failed to reset progress", err);
    }
  };

  if (!progress) return <p>Loading...</p>;

  const taskNames: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: "Task 1 - The Wild World of Password Security",
    2: "Task 2 - Rise of the Crusty Emails",
    3: "Task 3 - Remains to be Seen",
    4: "Task 4 - Physical Security Task",
    5: "Task 5 - Finale: Viva la Baguette Restoration!",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      {showTask5UnlockEffect && (
        <div className="fixed inset-0 z-[999] pointer-events-none animate-redFlash" />
      )}
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
          {canShowTask5 && (
            <div
              className={`p-4 rounded-xl border-4 transition-all duration-300
                ${progress.task5_done ? "border-green-500" : "border-red-500"}
              `}
            >
            <h2 className="text-xl font-semibold mb-2">
              {taskNames[5]}
            </h2>

            {progress.task5_done ? (
              <div className="mt-3 text-left bg-green-50 p-3 rounded-lg shadow-inner">
                <p className="text-green-700 font-bold mb-2">✔ Completed</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {(taskStories as any)[5]}
                </p>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={inputs[5]}
                  onChange={(e) => setInputs({ ...inputs, 5: e.target.value })}
                  placeholder="Enter flag: BAGUETTE{...}"
                  className="w-full p-2 border rounded mb-3"
                />

                <button
                  onClick={() => submitFlag(5)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Submit Flag
                </button>

                {errors[5] && (
                  <p className="text-red-600 font-semibold mt-2">{errors[5]}</p>
                )}
              </>
            )}
          </div>
        )}
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
          confirmText="Reset"
          onClose={() => setShowResetConfirm(false)}
          forceShow={true}
          popupSource="flags"
          onConfirm={async () => {
            setShowResetConfirm(false);
            await resetProgress();
          }}
        />
      )}
      {showTask5UnlockPopup && (
        <InstructionPopup
          headerText="⚠ SYSTEM ALERT"
          text={
            "Message from the original Les Baguettes website developers:\n\n" +
            "Hi there. Your efforts are making it a bit annoying for us, actual criminals, to steal the information of this bakery and the website's users.\n\n" +
            "As a last resort, we've decided to sweep away the entire database. Have a look: it's no longer there.\n\n" +
            "Best of luck in your futile attempt of trying to restore it!\n\nBest regards,\n\n- The Les Baguettes Dev Team"
          }
          confirmText="Let's Go!"
          onClose={() => setShowTask5UnlockPopup(false)}
          forceShow={true}
          popupSource="flags"
        />
      )}
    </div>
  );
}

export default SubmitFlags;
