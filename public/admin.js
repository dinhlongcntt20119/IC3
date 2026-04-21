import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const ADMIN_EMAIL = "dinhlongcntt20119@gmail.com";

let db, auth;
let submissions = [];

// Navigation State
let currentView = 'grade'; // 'grade' | 'class' | 'student'
let selectedGrade = null;
let selectedClass = null;
let currentPage = 1;
const itemsPerPage = 20;

async function init() {
    const configRes = await fetch('/firebase-applet-config.json');
    const firebaseConfig = await configRes.json();
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
        experimentalForceLongPolling: true
    }, firebaseConfig.firestoreDatabaseId);

    const provider = new GoogleAuthProvider();

    // Elements
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminEmailEl = document.getElementById('admin-email');
    
    const searchInput = document.getElementById('search-input');
    const detailModal = document.getElementById('detail-modal');
    const closeModal = document.getElementById('close-modal');

    loginBtn.onclick = () => signInWithPopup(auth, provider);
    logoutBtn.onclick = () => signOut(auth);
    closeModal.onclick = () => detailModal.classList.add('hidden');
    
    detailModal.onclick = (e) => {
        if (e.target === detailModal) detailModal.classList.add('hidden');
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.email === ADMIN_EMAIL) {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                adminEmailEl.innerText = user.email;
                startListening();
            } else {
                alert("Bạn không có quyền truy cập trang này!");
                signOut(auth);
            }
        } else {
            loginSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
        }
    });

    function startListening() {
        const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
        onSnapshot(q, (snapshot) => {
            submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateStats();
            renderCurrentView();
        });
    }

    function updateStats() {
        document.getElementById('total-submissions').innerText = submissions.length;
        document.getElementById('unique-students').innerText = new Set(submissions.map(s => s.studentName)).size;
        document.getElementById('total-classes').innerText = new Set(submissions.map(s => s.studentClass)).size;
        
        const avg = submissions.length > 0 
            ? Math.round(submissions.reduce((a, b) => a + (b.score / b.totalQuestions), 0) / submissions.length * 100) 
            : 0;
        document.getElementById('avg-score').innerText = `${avg}%`;
    }

    // Breadcrumb and View Switching logic
    document.getElementById('bc-home').onclick = () => {
        if(currentView !== 'grade') {
            currentView = 'grade';
            selectedGrade = null;
            selectedClass = null;
            renderCurrentView();
        }
    };

    document.getElementById('bc-grade').onclick = () => {
        if(currentView === 'student') {
            currentView = 'class';
            selectedClass = null;
            renderCurrentView();
        }
    };

    window.selectGrade = (grade) => {
        selectedGrade = grade;
        currentView = 'class';
        renderCurrentView();
    };

    window.selectClass = (cls) => {
        selectedClass = cls;
        currentView = 'student';
        currentPage = 1;
        renderCurrentView();
    };

    function updateBreadcrumbs() {
        const breadcrumbs = document.getElementById('breadcrumbs');
        const bcSep1 = document.getElementById('bc-sep-1');
        const bcGrade = document.getElementById('bc-grade');
        const bcSep2 = document.getElementById('bc-sep-2');
        const bcClass = document.getElementById('bc-class');

        if (currentView === 'grade') {
            breadcrumbs.classList.add('hidden');
        } else if (currentView === 'class') {
            breadcrumbs.classList.remove('hidden');
            bcSep1.classList.remove('hidden');
            bcGrade.classList.remove('hidden');
            bcGrade.innerText = `Khối ${selectedGrade}`;
            bcGrade.classList.add('text-slate-800');
            bcGrade.disabled = true;
            bcSep2.classList.add('hidden');
            bcClass.classList.add('hidden');
        } else if (currentView === 'student') {
            breadcrumbs.classList.remove('hidden');
            bcSep1.classList.remove('hidden');
            bcGrade.classList.remove('hidden');
            bcGrade.innerText = `Khối ${selectedGrade}`;
            bcGrade.classList.remove('text-slate-800');
            bcGrade.disabled = false;
            bcSep2.classList.remove('hidden');
            bcClass.classList.remove('hidden');
            bcClass.innerText = `Lớp ${selectedClass}`;
        }
    }

    function renderCurrentView() {
        updateBreadcrumbs();
        
        document.getElementById('grade-view').classList.add('hidden');
        document.getElementById('class-view').classList.add('hidden');
        document.getElementById('student-view').classList.add('hidden');

        if (currentView === 'grade') {
            document.getElementById('grade-view').classList.remove('hidden');
            renderGradeView();
        } else if (currentView === 'class') {
            document.getElementById('class-view').classList.remove('hidden');
            renderClassView();
        } else if (currentView === 'student') {
            document.getElementById('student-view').classList.remove('hidden');
            renderStudentView();
        }
    }

    function renderGradeView() {
        const gradeView = document.getElementById('grade-view');
        const grades = [3, 4, 5];
        
        gradeView.innerHTML = grades.map(g => {
            const count = new Set(submissions.filter(s => s.grade == g).map(s => s.studentName)).size;
            const subCount = submissions.filter(s => s.grade == g).length;
            
            return `
                <button onclick="window.selectGrade(${g})" 
                    class="bg-[#0388e5] text-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:bg-[#0277cc] transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center group border border-[#026cbb]">
                    <svg class="w-12 h-12 mb-4 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <h3 class="text-2xl font-black mb-1">Khối ${g}</h3>
                    <p class="text-sm font-medium opacity-80">${count} học sinh (${subCount} bài)</p>
                </button>
            `;
        }).join('');
    }

    function renderClassView() {
        const classGrid = document.getElementById('class-grid');
        // Get unique classes for this grade that have submissions
        // Wait, what if there are no submissions yet for some classes? We might want to construct the list manually based on standard classes (4A->4H) or based on existing facts.
        // Let's rely on data that actually exists, but sort it logically.
        let classes = [...new Set(submissions.filter(s => s.grade == selectedGrade).map(s => s.studentClass))].sort();
        
        if (classes.length === 0) {
            classGrid.innerHTML = '<div class="w-full text-center py-10 text-gray-400 italic">Chưa có dữ liệu lớp học cho khối này.</div>';
            return;
        }

        classGrid.innerHTML = classes.map(c => {
            const count = new Set(submissions.filter(s => s.grade == selectedGrade && s.studentClass === c).map(s => s.studentName)).size;
            
            return `
                <button onclick="window.selectClass('${c}')" 
                    class="bg-white border-2 border-[#1565C0] text-[#1565C0] rounded-2xl py-6 px-10 flex flex-col items-center justify-center hover:bg-[#1565C0] hover:text-white transition-all shadow-sm hover:shadow-md md:w-auto w-[calc(50%-0.5rem)]">
                    <span class="text-2xl font-black mb-1">${c}</span>
                    <span class="text-sm font-medium text-inherit opacity-80">${count} học sinh</span>
                </button>
            `;
        }).join('');
    }

    function renderStudentView() {
        const resultsBody = document.getElementById('results-body');
        const searchVal = searchInput.value.toLowerCase();
        document.getElementById('table-title').innerText = `Danh sách học sinh - Lớp ${selectedClass}`;

        let filtered = submissions.filter(s => 
            s.grade == selectedGrade && 
            s.studentClass === selectedClass
        );

        if (searchVal) {
            filtered = filtered.filter(s => 
                s.studentName.toLowerCase().includes(searchVal) || 
                s.lessonTitle.toLowerCase().includes(searchVal)
            );
        }

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const paginatedData = filtered.slice(startIdx, endIdx);

        // Update Pagination UI
        document.getElementById('page-info').innerText = `Hiển thị ${totalItems > 0 ? startIdx + 1 : 0}-${Math.min(endIdx, totalItems)} trên ${totalItems}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;

        if (paginatedData.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="8" class="p-10 text-center text-gray-400">Không tìm thấy kết quả nào.</td></tr>';
            document.getElementById('select-all-checkbox').checked = false;
            window.updateDeleteBtnState();
            return;
        }

        resultsBody.innerHTML = paginatedData.map(s => {
            const date = s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleString('vi-VN') : 'Đang xử lý...';
            const percent = Math.round((s.score / s.totalQuestions) * 100);
            const scoreColor = percent >= 80 ? 'text-green-600' : (percent >= 50 ? 'text-orange-500' : 'text-red-500');

            return `
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-4 text-center">
                        <input type="checkbox" value="${s.id}" class="student-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" onchange="window.updateDeleteBtnState()">
                    </td>
                    <td class="px-4 py-4 font-semibold text-slate-800">
                        <button onclick="window.viewDetails('${s.id}')" class="hover:text-blue-600 hover:underline transition-all text-left">
                            ${s.studentName}
                        </button>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 font-bold">${s.studentClass}</td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-600">${s.lessonTitle.split('/').pop()}</td>
                    <td class="px-6 py-4 text-center text-sm">${s.grade}</td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-3 py-1 rounded-full bg-gray-100 font-bold text-sm ${scoreColor}">
                            ${s.score}/${s.totalQuestions}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-400 font-mono">${date}</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="window.deleteSubmission('${s.id}')" class="text-red-400 hover:text-red-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        const selectAllCb = document.getElementById('select-all-checkbox');
        if (selectAllCb) selectAllCb.checked = false;
        if (window.updateDeleteBtnState) window.updateDeleteBtnState();
    }

    searchInput.oninput = () => {
        currentPage = 1;
        renderStudentView();
    };

    document.getElementById('prev-page').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderStudentView();
        }
    };

    document.getElementById('next-page').onclick = () => {
        currentPage++;
        renderStudentView();
    };

    // Keep existing modal and delete logic
    window.viewDetails = (id) => {
        const s = submissions.find(x => x.id === id);
        if (!s) return;
        const modalStudentName = document.getElementById('modal-student-name');
        const modalLessonTitle = document.getElementById('modal-lesson-title');
        const modalContent = document.getElementById('modal-content');
        
        modalStudentName.innerText = s.studentName;
        modalLessonTitle.innerText = `${s.lessonTitle.split('/').pop()} - Lớp ${s.studentClass} - Khối ${s.grade}`;
        
        const scorePercent = Math.round(s.score / s.totalQuestions * 100);
        let scoreCardBg = '', scoreCardBorder = '', scoreCardText = '';
        if (scorePercent >= 80) { scoreCardBg = '#d4edda'; scoreCardBorder = '#c3e6cb'; scoreCardText = '#155724'; }
        else if (scorePercent >= 50) { scoreCardBg = '#fff3cd'; scoreCardBorder = '#ffeeba'; scoreCardText = '#856404'; }
        else { scoreCardBg = '#f8d7da'; scoreCardBorder = '#f5c6cb'; scoreCardText = '#721c24'; }

        let html = `
            <style>
                .admin-q-card {
                    background: white; border: 1px solid #dee2e6; border-radius: 10px; 
                    margin-bottom: 20px; overflow: hidden; text-align: left;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.05); padding: 25px;
                }
                .admin-q-topic-badge {
                    background-color: #28a745; color: white; padding: 4px 10px; border-radius: 4px; 
                    font-size: 0.85rem; font-weight: bold; margin-right: 8px; text-transform: uppercase;
                    vertical-align: middle; display: inline-block; margin-bottom: 4px;
                }
                .admin-q-content { width: 100%; background: #fff; }
                .admin-q-text { font-weight: 700; font-size: 1.1rem; margin-bottom: 20px; color: #2c3e50; line-height: 1.5; }
                .admin-q-opts { display: flex; flex-direction: column; gap: 10px; }
                .admin-q-opts label {
                    display: block; padding: 12px 15px; border: 2px solid #f1f1f1; border-radius: 8px; margin: 0;
                }
                .admin-q-opts label.correct-opt { border-color: #28a745; background-color: #d4edda; }
                .admin-q-opts label.wrong-opt { border-color: #dc3545; background-color: #f8d7da; }
                .admin-q-opts label.missed-opt { border: 2px dashed #28a745; }
                .admin-q-table-container { overflow-x: auto; border-radius: 8px; border: 1px solid #dee2e6; }
                .admin-q-table { width: 100%; border-collapse: collapse; margin: 0; }
                .admin-q-table th { background-color: #28a745; color: white; padding: 15px; text-align: center; font-weight: 700; border-bottom: 2px solid #fff; }
                .admin-q-table td { border-bottom: 1px solid #dee2e6; padding: 15px; vertical-align: middle; }
                .admin-q-table tr:nth-child(even) { background-color: #fcfcfc; }
                .admin-q-table td:first-child { width: 60%; font-weight: 500; text-align: left; }
                .admin-q-table td:not(:first-child) { width: 20%; text-align: center; }
                .admin-q-input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 0.95rem; background: white; appearance: none; color: #333; font-weight: bold;}
                .admin-q-input.correct-row { border-color: #28a745; background-color: #d4edda; }
                .admin-q-input.wrong-row { border-color: #dc3545; background-color: #f8d7da; }
                .admin-q-explain { margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 5px solid #ffc107; font-size: 0.95rem; color: #856404; }
                
                @media (max-width: 768px) {
                    .admin-q-card { padding: 15px; }
                    .admin-q-table td:first-child { width: 50%; }
                    .admin-q-table td:not(:first-child) { width: 25%; }
                }
            </style>
            <div style="background-color: ${scoreCardBg}; border: 1px solid ${scoreCardBorder}; color: ${scoreCardText}; padding: 24px; border-radius: 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Kết quả tổng quát</div>
                    <div style="font-size: 1.875rem; font-weight: 900;">${s.score} / ${s.totalQuestions} (${scorePercent}%)</div>
                </div>
                <div style="font-size: 2.25rem;">
                    ${scorePercent >= 80 ? '🌟' : (scorePercent >= 50 ? '👍' : '📚')}
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px;">
        `;

        if (s.quizDetails && Array.isArray(s.quizDetails)) {
            s.quizDetails.forEach((item) => {
                const isCorrect = item.isCorrect !== undefined ? item.isCorrect : false;
                const statusColor = item.isCorrect === true ? 'border-green-200' : (item.isCorrect === false && item.selected ? 'border-red-200' : 'border-gray-200');
                const statusIcon = item.isCorrect === true ? '✅' : (item.isCorrect === false && item.selected ? '❌' : '⚪');
                const qText = item.qText || 'Nội dung câu hỏi (Dữ liệu cũ không lưu nội dung)';
                
                if (item.questionData) {
                    const q = item.questionData;
                    const val = item.selected;

                    let questionHtml = `
                        <div class="admin-q-card">
                            <div class="admin-q-content">
                                <div class="admin-q-text"><span class="admin-q-topic-badge">Chủ đề ${String(item.qNum).replace('q','').padStart(2, '0')}</span> ${q.q}</div>
                    `;

                    if (q.type === 'radio' || q.type === 'check') {
                        questionHtml += `<div class="admin-q-opts">`;
                        q.opts.forEach(opt => {
                            let isStudentSelected = false;
                            let isOptCorrect = false;

                            if (q.type === 'radio') {
                                isStudentSelected = (val === opt.v);
                                isOptCorrect = (q.ans === opt.v);
                            } else {
                                isStudentSelected = Array.isArray(val) && val.includes(opt.v);
                                isOptCorrect = Array.isArray(q.ans) && q.ans.includes(opt.v);
                            }

                            let optClass = "";
                            if (isStudentSelected && isOptCorrect) {
                                optClass = "correct-opt";
                            } else if (isStudentSelected && !isOptCorrect) {
                                optClass = "wrong-opt";
                            } else if (!isStudentSelected && isOptCorrect) {
                                optClass = "missed-opt";
                            }

                            let inputType = q.type === 'radio' ? 'radio' : 'checkbox';
                            let checkedAttr = isStudentSelected ? 'checked' : '';
                            
                            questionHtml += `<label class="${optClass}"><input type="${inputType}" disabled ${checkedAttr} style="transform: scale(1.3); margin-right: 12px; accent-color: #28a745;"> ${opt.t}</label>`;
                        });
                        questionHtml += `</div>`;
                    } else if (q.type === 'match') {
                        questionHtml += `
                            <div class="admin-q-table-container">
                                <table class="admin-q-table">
                                    <thead><tr><th>Định nghĩa/Mô tả</th><th>Thuật ngữ/Lựa chọn</th></tr></thead>
                                    <tbody>
                        `;
                        q.rows.forEach((r, rIdx) => {
                            let userVal = Array.isArray(val) ? val[rIdx] : null;
                            let correctVal = r.a;
                            let isRowCorrect = userVal === correctVal;

                            let userText = userVal ? (q.opts.find(o => o.v === userVal)?.t || userVal) : "-- Trống --";
                            let inputClass = userVal ? (isRowCorrect ? 'background-color: #d4edda;' : 'background-color: #f8d7da;') : '';

                            questionHtml += `
                                <tr>
                                    <td>${r.t}</td>
                                    <td style="${inputClass}">
                                        ${userText}
                                        ${(!isRowCorrect && userVal) ? `<div style="margin-top: 5px; font-size: 0.8rem; color: #1e7e34; font-weight: bold;">Đáp án đúng: ${q.opts.find(o=>o.v===correctVal)?.t || correctVal}</div>` : ''}
                                        ${(!userVal) ? `<div style="margin-top: 5px; font-size: 0.8rem; color: #1e7e34; font-weight: bold;">Đáp án: ${q.opts.find(o=>o.v===correctVal)?.t || correctVal}</div>` : ''}
                                    </td>
                                </tr>
                            `;
                        });
                        questionHtml += `</tbody></table></div>`;
                    } else if (q.type === 'table_tf') {
                        questionHtml += `
                            <div class="admin-q-table-container">
                                <table class="admin-q-table">
                                    <thead><tr><th>Nội dung</th><th>${q.headers?.[0] || 'Có (Yes)'}</th><th>${q.headers?.[1] || 'Không (No)'}</th></tr></thead>
                                    <tbody>
                        `;
                        q.rows.forEach((r, rIdx) => {
                            let userVal = Array.isArray(val) ? val[rIdx] : null;
                            let correctVal = r.a;
                            let isRowCorrect = userVal === correctVal;

                            let classYes = userVal === 'yes' ? (isRowCorrect ? 'background-color: #d4edda;' : 'background-color: #f8d7da;') : (correctVal === 'yes' && userVal ? 'border: 2px dashed #28a745;' : '');
                            let classNo = userVal === 'no' ? (isRowCorrect ? 'background-color: #d4edda;' : 'background-color: #f8d7da;') : (correctVal === 'no' && userVal ? 'border: 2px dashed #28a745;' : '');

                            questionHtml += `
                                <tr>
                                    <td>${r.t}</td>
                                    <td style="${classYes} text-align: center; font-weight: bold; font-size: 1.2rem; color: ${userVal === 'yes' ? (isRowCorrect ? '#155724' : '#721c24') : '#28a745'}">${userVal === 'yes' ? (isRowCorrect ? '✓' : '✗') : ''}</td>
                                    <td style="${classNo} text-align: center; font-weight: bold; font-size: 1.2rem; color: ${userVal === 'no' ? (isRowCorrect ? '#155724' : '#721c24') : '#28a745'}">${userVal === 'no' ? (isRowCorrect ? '✓' : '✗') : ''}</td>
                                </tr>
                            `;
                        });
                        questionHtml += `</tbody></table></div>`;
                    }

                    if (q.explain) {
                        questionHtml += `
                            <div class="admin-q-explain">
                                <strong>Diễn giải:</strong> ${q.explain}
                            </div>
                        `;
                    }

                    questionHtml += `
                            </div>
                        </div>
                    `;
                    
                    html += questionHtml;
                } else {
                    // Hiển thị cho bài làm cũ (fallback)
                    let isLegacyTable = item.answerText && item.answerText.includes(' | ') && item.answerText.includes(']: ');
                    
                    let fallbackHtml = ``;
                    
                    // Caculate offset for old entries mapping "1" to "16" based on lesson part
                    let displayQNum = item.qNum;
                    if (String(displayQNum).length < 3) {
                        let offset = 0;
                        if (s.lessonTitle && (s.lessonTitle.includes('Phần 1.2') || s.lessonTitle.includes('Phần 2.2'))) offset = 15;
                        displayQNum = parseInt(String(displayQNum).replace('q','')) + offset;
                    }
                    
                    if (isLegacyTable) {
                        let userParts = item.answerText.split(' | ');
                        // Attempt to detect if it's Table TF vs Match
                        let isTf = userParts.some(p => p.toLowerCase().endsWith(']: yes') || p.toLowerCase().endsWith(']: no'));
                        
                        fallbackHtml += `
                        <div class="admin-q-card">
                            <div class="admin-q-content">
                                <div class="admin-q-text"><span class="admin-q-topic-badge">Chủ đề ${String(displayQNum).padStart(2, '0')}</span> ${qText}</div>
                                <div class="admin-q-table-container">
                                    <table class="admin-q-table">
                        `;
                        
                        if (isTf) {
                            fallbackHtml += `<thead><tr><th>Nội dung</th><th>Có (Yes)</th><th>Không (No)</th></tr></thead><tbody>`;
                            userParts.forEach(p => {
                                let match = p.match(/^\[(.*?)\]:\s*(.*)$/);
                                if (match) {
                                    let rowText = match[1];
                                    let userAns = match[2].toLowerCase().trim(); // yes or no
                                    
                                    let correctAns = "";
                                    let cParts = (item.correctAnswer || '').split(' | ');
                                    let cMatch = cParts.find(cp => cp.startsWith(`[${rowText}]:`));
                                    if (cMatch) {
                                        let cm = cMatch.match(/^\[(.*?)\]:\s*(.*)$/);
                                        if (cm) correctAns = cm[2].toLowerCase().trim();
                                    }
                                    
                                    let isRowCorrect = userAns === correctAns;
                                    let classYes = userAns === 'yes' ? (isRowCorrect ? 'background-color: #d4edda;' : 'background-color: #f8d7da;') : (correctAns === 'yes' && userAns ? 'border: 2px dashed #28a745;' : '');
                                    let classNo = userAns === 'no' ? (isRowCorrect ? 'background-color: #d4edda;' : 'background-color: #f8d7da;') : (correctAns === 'no' && userAns ? 'border: 2px dashed #28a745;' : '');
                                    
                                    fallbackHtml += `
                                        <tr>
                                            <td>${rowText}</td>
                                            <td style="${classYes} text-align: center; font-weight: bold; font-size: 1.2rem; color: ${userAns === 'yes' ? (isRowCorrect ? '#155724' : '#721c24') : '#28a745'}">${userAns === 'yes' ? (isRowCorrect ? '✓' : '✗') : ''}</td>
                                            <td style="${classNo} text-align: center; font-weight: bold; font-size: 1.2rem; color: ${userAns === 'no' ? (isRowCorrect ? '#155724' : '#721c24') : '#28a745'}">${userAns === 'no' ? (isRowCorrect ? '✓' : '✗') : ''}</td>
                                        </tr>
                                    `;
                                }
                            });
                        } else {
                            fallbackHtml += `<thead><tr><th>Định nghĩa/Mô tả</th><th>Thuật ngữ/Lựa chọn</th></tr></thead><tbody>`;
                            userParts.forEach(p => {
                                let match = p.match(/^\[(.*?)\]:\s*(.*)$/);
                                if (match) {
                                    let rowText = match[1];
                                    let userAns = match[2].trim();
                                    
                                    let correctAns = "";
                                    let cParts = (item.correctAnswer || '').split(' | ');
                                    let cMatch = cParts.find(cp => cp.startsWith(`[${rowText}]:`));
                                    if (cMatch) {
                                        let cm = cMatch.match(/^\[(.*?)\]:\s*(.*)$/);
                                        if (cm) correctAns = cm[2].trim();
                                    }
                                    
                                    let isRowCorrect = userAns === correctAns;
                                    let inputClass = userAns && userAns !== 'Chưa chọn' && userAns !== '' ? (isRowCorrect ? 'background-color: #d4edda;' : 'background-color: #f8d7da;') : '';
                                    
                                    fallbackHtml += `
                                        <tr>
                                            <td>${rowText}</td>
                                            <td style="${inputClass}">
                                                ${userAns}
                                                ${(!isRowCorrect) ? `<div style="margin-top: 5px; font-size: 0.8rem; color: #1e7e34; font-weight: bold;">Đáp án đúng: ${correctAns || '-'}</div>` : ''}
                                            </td>
                                        </tr>
                                    `;
                                }
                            });
                        }
                        
                        fallbackHtml += `</tbody></table></div></div></div>`;
                        html += fallbackHtml;
                    } else {
                        // Standard fallback view mapped to beautiful format
                        html += `
                        <div class="admin-q-card">
                            <div class="admin-q-content">
                                <div class="admin-q-text"><span class="admin-q-topic-badge">Chủ đề ${String(displayQNum).padStart(2, '0')}</span> ${qText}</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 1.05rem;">
                                    <div style="flex: 1; min-width: 200px; padding: 20px; border-radius: 8px; ${isCorrect ? 'background: #d4edda; border: 1px solid #c3e6cb;' : 'background: #f8d7da; border: 1px solid #f5c6cb;'}">
                                        <b style="color: ${isCorrect ? '#155724' : '#721c24'}; font-size: 0.8rem; text-transform: uppercase;">Đáp án của học sinh</b><div style="margin-bottom: 8px;"></div>
                                        <span style="color: ${isCorrect ? '#155724' : '#721c24'}; font-weight: bold;">${item.answerText || item.selected || 'Chưa chọn'}</span>
                                    </div>
                                    ${!isCorrect ? `
                                    <div style="flex: 1; min-width: 200px; padding: 20px; border-radius: 8px; background: #e2e3e5; border: 1px solid #d6d8db;">
                                        <b style="color: #383d41; font-size: 0.8rem; text-transform: uppercase;">Đáp án đúng</b><div style="margin-bottom: 8px;"></div>
                                        <span style="color: #383d41; font-weight: bold;">${item.correctAnswer || '-'}</span>
                                    </div>` : ''}
                                </div>
                            </div>
                        </div>
                        `;
                    }
                }
            });
        } else if (s.details) {
            html += '<div style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 8px;">';
            Object.entries(s.details).forEach(([key, val]) => {
                html += `
                    <div style="background-color: #f9fafb; padding: 12px; border-radius: 12px; border: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase;">${key.toUpperCase()}</span>
                        <span style="font-size: 0.875rem; font-weight: 700; color: #334155;">${val.toUpperCase()}</span>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<p style="font-size: 0.875rem; color: #9ca3af; font-style: italic; text-align: center; padding: 40px 0;">Không có dữ liệu chi tiết cho bài làm này.</p>';
        }

        html += '</div>';
        document.getElementById('modal-content').innerHTML = html;
        document.getElementById('detail-modal').classList.remove('hidden');
    };

    window.exportModalToPDF = () => {
        const studentName = document.getElementById('modal-student-name').innerText;
        const lessonTitle = document.getElementById('modal-lesson-title').innerText;
        const contentInner = document.getElementById('modal-content').innerHTML;

        const btn = event.currentTarget;
        const oldText = btn.innerHTML;
        btn.innerHTML = `<span class="hidden md:inline">Đang tạo PDF...</span>`;
        btn.disabled = true;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '794px';
        iframe.style.height = '1123px'; // A4
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        
        const safeStudentName = studentName.replace(/["\\/]/g, '').trim();
        const safeLessonTitle = lessonTitle.split(' - ')[0].replace(/["\\/]/g, '').trim();

        // Write content into standard iframe without Tailwind to avoid oklch stylesheet parsing errors
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <script>
                    function generatePDF() {
                        var script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                        script.onload = function() {
                            const opt = {
                                margin: [10, 10, 10, 10],
                                filename: "${safeStudentName} - ${safeLessonTitle}.pdf",
                                image: { type: 'jpeg', quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                            };
                            html2pdf().set(opt).from(document.body).save().then(() => {
                                window.parent.postMessage('pdf-done', '*');
                            }).catch(err => {
                                console.error(err);
                                window.parent.postMessage('pdf-error', '*');
                            });
                        };
                        document.head.appendChild(script);
                    }
                </script>
            </head>
            <body onload="generatePDF()" style="background: white; padding: 20px; font-family: 'Inter', sans-serif; color: #000; margin: 0;">
                <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 5px; color: #1e293b;">${studentName}</h1>
                <p style="font-size: 14px; font-weight: 500; color: #64748b; margin-bottom: 30px;">${lessonTitle}</p>
        `);
        doc.write(contentInner);
        doc.write(`
            </body>
            </html>
        `);
        doc.close();

        const messageHandler = function(e) {
            if (e.data === 'pdf-done' || e.data === 'pdf-error') {
                window.removeEventListener('message', messageHandler);
                document.body.removeChild(iframe);
                btn.innerHTML = oldText;
                btn.disabled = false;
                if(e.data === 'pdf-error') alert("Lỗi khi xuất PDF");
            }
        };
        window.addEventListener('message', messageHandler);
    };

    let pendingDeleteMode = null; // 'single' | 'multiple'
    let pendingDeleteId = null;
    let pendingDeleteBtn = null;

    window.deleteSubmission = async (id) => {
        pendingDeleteMode = 'single';
        pendingDeleteId = id;
        pendingDeleteBtn = event?.currentTarget;
        
        document.getElementById('confirm-message').innerText = "Bạn có chắc chắn muốn xóa bài làm này không?";
        document.getElementById('confirm-delete-btn').innerHTML = "Đồng ý";
        document.getElementById('confirm-delete-btn').disabled = false;
        document.getElementById('confirm-modal').classList.remove('hidden');
    };

    window.toggleSelectAll = (source) => {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(cb => cb.checked = source.checked);
        window.updateDeleteBtnState();
    };

    window.updateDeleteBtnState = () => {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        const btn = document.getElementById('delete-selected-btn');
        const countSpan = document.getElementById('selected-count');
        const selectAllCb = document.getElementById('select-all-checkbox');
        
        const allCheckboxes = document.querySelectorAll('.student-checkbox');

        if (checkboxes.length > 0) {
            btn.classList.remove('hidden');
            countSpan.innerText = checkboxes.length;
        } else {
            btn.classList.add('hidden');
        }

        if (allCheckboxes.length > 0 && checkboxes.length === allCheckboxes.length) {
            selectAllCb.checked = true;
        } else {
            selectAllCb.checked = false;
        }
    };

    window.deleteSelectedSubmissions = async () => {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        if (checkboxes.length === 0) return;

        pendingDeleteMode = 'multiple';
        
        document.getElementById('confirm-message').innerText = `Bạn có chắc chắn muốn xóa ${checkboxes.length} kết quả đã chọn?`;
        document.getElementById('confirm-delete-btn').innerHTML = "Đồng ý";
        document.getElementById('confirm-delete-btn').disabled = false;
        document.getElementById('confirm-modal').classList.remove('hidden');
    };

    window.cancelDelete = () => {
        document.getElementById('confirm-modal').classList.add('hidden');
        pendingDeleteMode = null;
        pendingDeleteId = null;
        pendingDeleteBtn = null;
    };

    window.confirmDelete = async () => {
        const confirmBtn = document.getElementById('confirm-delete-btn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = "Đang xóa...";

        if (pendingDeleteMode === 'single') {
            if (pendingDeleteBtn) pendingDeleteBtn.disabled = true;
            try {
                await deleteDoc(doc(db, "submissions", pendingDeleteId));
            } catch (err) {
                console.error("Delete failed:", err);
                alert(`Xóa thất bại. Lỗi: ${err.message}`);
                if (pendingDeleteBtn) pendingDeleteBtn.disabled = false;
            }
        } else if (pendingDeleteMode === 'multiple') {
            const checkboxes = document.querySelectorAll('.student-checkbox:checked');
            const mainBtn = document.getElementById('delete-selected-btn');
            mainBtn.disabled = true;
            
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                const id = checkboxes[i].value;
                try {
                    await deleteDoc(doc(db, "submissions", id));
                    successCount++;
                } catch (err) {
                    console.error("Delete failed for ID " + id, err);
                    failCount++;
                }
            }

            if (failCount > 0) {
                alert(`Đã xóa thành công ${successCount} mục. Có ${failCount} mục bị lỗi.`);
            }

            // Reset UI
            mainBtn.innerHTML = `Xóa mục đã chọn (<span id="selected-count">0</span>)`;
            mainBtn.disabled = false;
            document.getElementById('select-all-checkbox').checked = false;
            window.updateDeleteBtnState();
        }

        window.cancelDelete();
    };

    window.exportToExcel = () => {
        let filtered = submissions.filter(s => 
            s.grade == selectedGrade && 
            s.studentClass === selectedClass
        );

        const searchVal = searchInput.value.toLowerCase();
        if (searchVal) {
            filtered = filtered.filter(s => 
                s.studentName.toLowerCase().includes(searchVal) || 
                s.lessonTitle.toLowerCase().includes(searchVal)
            );
        }

        if (filtered.length === 0) {
            alert("Không có dữ liệu để xuất.");
            return;
        }

        const dataForExcel = filtered.map(s => {
            const dateStr = s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleString('vi-VN') : 'N/A';
            const percent = Math.round((s.score / s.totalQuestions) * 100);
            return {
                "Học sinh": s.studentName,
                "Lớp": s.studentClass,
                "Khối": s.grade,
                "Bài thi": s.lessonTitle.split('/').pop(),
                "Điểm số": `${s.score}/${s.totalQuestions}`,
                "Phần trăm (%)": percent,
                "Thời gian nộp": dateStr
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachHocSinh");
        
        const fileName = `KetQua_Khoi${selectedGrade}_Lop${selectedClass}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };
}

init();

