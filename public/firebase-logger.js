import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { initializeFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

async function initLogger() {
    try {
        const configRes = await fetch('/firebase-applet-config.json');
        const firebaseConfig = await configRes.json();
        const app = initializeApp(firebaseConfig);
        const db = initializeFirestore(app, {
            experimentalForceLongPolling: true
        }, firebaseConfig.firestoreDatabaseId);

        console.log("Firebase Logger Initialized");

        // Patch gradeQuiz
        const originalGradeQuiz = window.gradeQuiz;
        if (typeof originalGradeQuiz === 'function') {
            window.gradeQuiz = async function() {
                // Run original logic
                originalGradeQuiz();

                // Extract results from DOM
                const resultArea = document.getElementById('result-area');
                if (resultArea && resultArea.style.display !== 'none') {
                    const urlParams = new URLSearchParams(window.location.search);
                    const studentName = urlParams.get('name');
                    const studentClass = urlParams.get('class');
                    const grade = parseInt(urlParams.get('grade'));

                    if (!studentName || !studentClass || isNaN(grade)) {
                        console.warn("Student info missing in URL, cannot save result.");
                        return;
                    }

                    const scoreText = resultArea.innerText;
                    // Format: "KẾT QUẢ: 24 / 30 CHỦ ĐỀ ĐÚNG (80%)"
                    const scoreMatch = scoreText.match(/KẾT QUẢ: (\d+) \/ (\d+)/);
                    
                    if (scoreMatch) {
                        const score = parseInt(scoreMatch[1]);
                        const total = parseInt(scoreMatch[2]);
                        const lessonTitle = document.title || window.location.pathname;

                        const details = [];
                        if (window.questions && Array.isArray(window.questions)) {
                            window.questions.forEach((q, i) => {
                                const name = `q${i + 1}`;
                                const selected = document.querySelector(`input[name="${name}"]:checked, select[name="${name}"]`);
                                const val = selected ? selected.value : null;

                                let studentAnswerText = "Chưa chọn";
                                if (val) {
                                    const option = q.opts.find(o => o.v === val);
                                    studentAnswerText = option ? option.t : val;
                                }

                                details.push({
                                    qText: q.q,
                                    qNum: i + 1,
                                    selected: val,
                                    answerText: studentAnswerText,
                                    correctAnswer: q.ans,
                                    isCorrect: val === q.ans
                                });
                            });
                        } else {
                            // Fallback if questions array is not found
                            document.querySelectorAll('#quiz-form input:checked').forEach(inp => {
                                details.push({ qNum: inp.name, selected: inp.value });
                            });
                        }

                        try {
                            await addDoc(collection(db, "submissions"), {
                                studentName,
                                studentClass,
                                grade,
                                lessonTitle,
                                score,
                                totalQuestions: total,
                                quizDetails: details, // Renamed to avoid confusion with the old structure
                                submittedAt: serverTimestamp()
                            });
                            console.log("Result saved to Firestore");
                            alert("Bài làm đã được lưu thành công!");
                        } catch (e) {
                            console.error("Error saving to Firestore:", e);
                            alert("Có lỗi khi lưu bài làm. Vui lòng báo cho giáo viên.");
                        }
                    }
                }
            };
        } else {
            console.warn("gradeQuiz function not found on window object.");
        }
    } catch (err) {
        console.error("Failed to initialize Firebase Logger:", err);
    }
}

initLogger();
