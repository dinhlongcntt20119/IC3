import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

async function initLogger() {
    try {
        const configRes = await fetch('/firebase-applet-config.json');
        const firebaseConfig = await configRes.json();
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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

                        const details = {};
                        document.querySelectorAll('#quiz-form input:checked').forEach(inp => {
                            details[inp.name] = inp.value;
                        });
                        document.querySelectorAll('#quiz-form select').forEach(sel => {
                            details[sel.name] = sel.value;
                        });

                        try {
                            await addDoc(collection(db, "submissions"), {
                                studentName,
                                studentClass,
                                grade,
                                lessonTitle,
                                score,
                                totalQuestions: total,
                                details,
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
