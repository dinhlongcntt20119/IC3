import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { initializeFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

function showCustomAlert(message, isSuccess = true) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '999999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.backdropFilter = 'blur(3px)';

    const modal = document.createElement('div');
    modal.style.backgroundColor = '#ffffff';
    modal.style.padding = '30px 20px';
    modal.style.borderRadius = '24px';
    modal.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
    modal.style.textAlign = 'center';
    modal.style.maxWidth = '360px';
    modal.style.width = '90%';
    modal.style.transform = 'scale(0.8) translateY(20px)';
    modal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    modal.style.fontFamily = "'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    const iconContainer = document.createElement('div');
    iconContainer.style.marginBottom = '20px';
    iconContainer.style.display = 'flex';
    iconContainer.style.justifyContent = 'center';
    
    if (isSuccess) {
        iconContainer.innerHTML = '<div style="width: 80px; height: 80px; background-color: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 10px rgba(40,167,69,0.1);"><svg style="width: 45px; height: 45px; color: #28a745;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path></svg></div>';
    } else {
        iconContainer.innerHTML = '<div style="width: 80px; height: 80px; background-color: #fce4e4; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 10px rgba(220,53,69,0.1);"><svg style="width: 45px; height: 45px; color: #dc3545;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M6 18L18 6M6 6l12 12"></path></svg></div>';
    }

    const title = document.createElement('h3');
    title.innerText = isSuccess ? 'Nộp bài thành công!' : 'Có lỗi xảy ra!';
    title.style.margin = '0 0 12px 0';
    title.style.color = '#2c3e50';
    title.style.fontSize = '24px';
    title.style.fontWeight = '800';

    const msg = document.createElement('p');
    msg.innerText = message;
    msg.style.margin = '0 0 28px 0';
    msg.style.color = '#64748b';
    msg.style.fontSize = '15px';
    msg.style.lineHeight = '1.6';

    const btn = document.createElement('button');
    btn.innerText = isSuccess ? 'Đóng và Xem kết quả' : 'Đóng';
    btn.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '14px 35px';
    btn.style.borderRadius = '30px';
    btn.style.fontSize = '16px';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = isSuccess ? '0 4px 15px rgba(40,167,69,0.3)' : '0 4px 15px rgba(220,53,69,0.3)';
    btn.style.transition = 'all 0.2s';
    
    btn.onmouseover = () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = isSuccess ? '0 6px 20px rgba(40,167,69,0.4)' : '0 6px 20px rgba(220,53,69,0.4)';
    };
    btn.onmouseout = () => {
        btn.style.transform = 'none';
        btn.style.boxShadow = isSuccess ? '0 4px 15px rgba(40,167,69,0.3)' : '0 4px 15px rgba(220,53,69,0.3)';
    };

    btn.onclick = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8) translateY(20px)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    };

    modal.appendChild(iconContainer);
    modal.appendChild(title);
    modal.appendChild(msg);
    modal.appendChild(btn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1) translateY(0)';
    });
}

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
                                    let rawVals = [];
                                    q.rows.forEach((r, rIdx) => {
                                        const sel = document.querySelector(`select[name="q${i}_${rIdx}"]`);
                                        const userVal = sel ? sel.value : "";
                                        rawVals.push(userVal);
                                        const correctVal = r.a;
                                        if (userVal === correctVal) subCorrects++;
                                        const uText = userVal ? (q.opts.find(o => o.v === userVal)?.t || userVal) : "Chưa chọn";
                                        const cText = q.opts.find(o => o.v === correctVal)?.t || correctVal;
                                        ansTexts.push(`[${r.t}]: ${uText}`);
                                        cAnsTexts.push(`[${r.t}]: ${cText}`);
                                    });
                                    val = rawVals;
                                    studentAnswerText = ansTexts.join(" | ");
                                    correctAnswerStr = cAnsTexts.join(" | ");
                                    isCorrect = subCorrects === q.rows.length;
                                } else if (q.type === 'table_tf') {
                                    let subCorrects = 0;
                                    let ansTexts = [];
                                    let cAnsTexts = [];
                                    let rawVals = [];
                                    q.rows.forEach((r, rIdx) => {
                                        const checked = document.querySelector(`input[name="q${i}_${rIdx}"]:checked`);
                                        const userVal = checked ? checked.value : "";
                                        rawVals.push(userVal);
                                        const correctVal = r.a;
                                        if (userVal === correctVal) subCorrects++;
                                        ansTexts.push(`[${r.t}]: ${userVal}`);
                                        cAnsTexts.push(`[${r.t}]: ${correctVal}`);
                                    });
                                    val = rawVals;
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
                                    isCorrect: isCorrect,
                                    questionData: q
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
                            showCustomAlert("Bài làm của bạn đã được ghi nhận trên hệ thống. Giỏi lắm!", true);
                        } catch (e) {
                            console.error("Error saving to Firestore:", e);
                            showCustomAlert("Có lỗi khi lưu kết quả. Vui lòng thử lại hoặc báo cho giáo viên.", false);
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
