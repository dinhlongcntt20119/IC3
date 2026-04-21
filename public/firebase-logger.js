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

                        // Expose `questions` which might be a global const/let (not on window)
                        if (!window.questions) {
                            try {
                                const s = document.createElement('script');
                                s.textContent = "window.exposedQuestions = (typeof questions !== 'undefined') ? questions : null;";
                                document.body.appendChild(s);
                                document.body.removeChild(s);
                            } catch (e) {}
                        }
                        const myQuestions = window.questions || window.exposedQuestions;

                        const details = [];
                        if (myQuestions && Array.isArray(myQuestions)) {
                            myQuestions.forEach((q, i) => {
                                let studentAnswerText = "Chưa chọn";
                                let val = null;
                                let isCorrect = false;
                                let correctAnswerStr = "";

                                if (q.type === 'radio') {
                                    const selected = document.querySelector(`input[name="q${i}"]:checked`);
                                    val = selected ? selected.value : null;
                                    studentAnswerText = val ? (q.opts.find(o => o.v === val)?.t || val) : "Chưa chọn";
                                    isCorrect = val === q.ans;
                                    correctAnswerStr = q.opts.find(o => o.v === q.ans)?.t || q.ans;
                                } else if (q.type === 'check') {
                                    const checked = Array.from(document.querySelectorAll(`input[name="q${i}"]:checked`)).map(e => e.value);
                                    val = checked;
                                    studentAnswerText = checked.length > 0 ? checked.map(v => q.opts.find(o => o.v === v)?.t || v).join(", ") : "Chưa chọn";
                                    if (Array.isArray(q.ans)) {
                                        isCorrect = JSON.stringify(checked.sort()) === JSON.stringify([...q.ans].sort());
                                        correctAnswerStr = q.ans.map(v => q.opts.find(o => o.v === v)?.t || v).join(", ");
                                    }
                                } else if (q.type === 'match') {
                                    let subCorrects = 0;
                                    let ansTexts = [];
                                    let cAnsTexts = [];
                                    q.rows.forEach((r, rIdx) => {
                                        const sel = document.querySelector(`select[name="q${i}_${rIdx}"]`);
                                        const userVal = sel ? sel.value : "";
                                        const correctVal = r.a;
                                        if (userVal === correctVal) subCorrects++;
                                        const uText = userVal ? (q.opts.find(o => o.v === userVal)?.t || userVal) : "Chưa chọn";
                                        const cText = q.opts.find(o => o.v === correctVal)?.t || correctVal;
                                        ansTexts.push(`[${r.t}]: ${uText}`);
                                        cAnsTexts.push(`[${r.t}]: ${cText}`);
                                    });
                                    val = ansTexts;
                                    studentAnswerText = ansTexts.join(" | ");
                                    correctAnswerStr = cAnsTexts.join(" | ");
                                    isCorrect = subCorrects === q.rows.length;
                                } else if (q.type === 'table_tf') {
                                    let subCorrects = 0;
                                    let ansTexts = [];
                                    let cAnsTexts = [];
                                    q.rows.forEach((r, rIdx) => {
                                        const checked = document.querySelector(`input[name="q${i}_${rIdx}"]:checked`);
                                        const userVal = checked ? checked.value : "";
                                        const correctVal = r.a;
                                        if (userVal === correctVal) subCorrects++;
                                        ansTexts.push(`[${r.t}]: ${userVal}`);
                                        cAnsTexts.push(`[${r.t}]: ${correctVal}`);
                                    });
                                    val = ansTexts;
                                    studentAnswerText = ansTexts.join(" | ");
                                    correctAnswerStr = cAnsTexts.join(" | ");
                                    isCorrect = subCorrects === q.rows.length;
                                } else {
                                    // Fallback for unknown types
                                    const selected = document.querySelector(`input[name="q${i}"]:checked, select[name="q${i}"]`);
                                    val = selected ? selected.value : null;
                                    studentAnswerText = val || "Chưa chọn";
                                    correctAnswerStr = q.ans || "N/A";
                                    isCorrect = val === q.ans;
                                }

                                details.push({
                                    qText: q.q,
                                    qNum: i + 1,
                                    selected: val,
                                    answerText: studentAnswerText,
                                    correctAnswer: correctAnswerStr,
                                    isCorrect: isCorrect
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
