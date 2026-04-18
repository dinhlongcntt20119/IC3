import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const ADMIN_EMAIL = "dinhlongcntt20119@gmail.com";

let db, auth;
let submissions = [];

async function init() {
    const configRes = await fetch('/firebase-applet-config.json');
    const firebaseConfig = await configRes.json();
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    const provider = new GoogleAuthProvider();

    // Elements
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminEmailEl = document.getElementById('admin-email');
    const resultsBody = document.getElementById('results-body');
    
    const totalSubEl = document.getElementById('total-submissions');
    const uniqueStudentsEl = document.getElementById('unique-students');
    const totalClassesEl = document.getElementById('total-classes');
    const avgScoreEl = document.getElementById('avg-score');

    const gradeFilter = document.getElementById('grade-filter');
    const classFilter = document.getElementById('class-filter');
    const searchInput = document.getElementById('search-input');

    const detailModal = document.getElementById('detail-modal');
    const closeModal = document.getElementById('close-modal');
    const modalStudentName = document.getElementById('modal-student-name');
    const modalLessonTitle = document.getElementById('modal-lesson-title');
    const modalContent = document.getElementById('modal-content');

    loginBtn.onclick = () => signInWithPopup(auth, provider);
    logoutBtn.onclick = () => signOut(auth);
    closeModal.onclick = () => detailModal.classList.add('hidden');
    
    // Close on background click
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
            updateClassFilter();
            render();
        });
    }

    function updateClassFilter() {
        const classes = [...new Set(submissions.map(s => s.studentClass))].sort();
        const currentSelection = classFilter.value;
        classFilter.innerHTML = '<option value="all">Tất cả Lớp</option>';
        classes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.innerText = `Lớp ${c}`;
            classFilter.appendChild(opt);
        });
        classFilter.value = currentSelection;
    }

    function render() {
        const gradeVal = gradeFilter.value;
        const classVal = classFilter.value;
        const searchVal = searchInput.value.toLowerCase();

        const filtered = submissions.filter(s => {
            const matchGrade = gradeVal === 'all' || s.grade.toString() === gradeVal;
            const matchClass = classVal === 'all' || s.studentClass === classVal;
            const matchSearch = s.studentName.toLowerCase().includes(searchVal);
            return matchGrade && matchClass && matchSearch;
        });

        // Update Stats
        totalSubEl.innerText = submissions.length;
        uniqueStudentsEl.innerText = new Set(submissions.map(s => s.studentName)).size;
        totalClassesEl.innerText = new Set(submissions.map(s => s.studentClass)).size;
        
        const avg = submissions.length > 0 
            ? Math.round(submissions.reduce((a, b) => a + (b.score / b.totalQuestions), 0) / submissions.length * 100) 
            : 0;
        avgScoreEl.innerText = `${avg}%`;

        if (filtered.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="6" class="p-10 text-center text-gray-400">Không tìm thấy kết quả nào.</td></tr>';
            return;
        }

        resultsBody.innerHTML = filtered.map(s => {
            const date = s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleString('vi-VN') : 'Đang xử lý...';
            const percent = Math.round((s.score / s.totalQuestions) * 100);
            const scoreColor = percent >= 80 ? 'text-green-600' : (percent >= 50 ? 'text-orange-500' : 'text-red-500');

            return `
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-slate-800">
                        <button onclick="window.viewDetails('${s.id}')" class="hover:text-blue-600 hover:underline transition-all text-left">
                            ${s.studentName}
                        </button>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">Lớp ${s.studentClass} (Khối ${s.grade})</td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-600">${s.lessonTitle.split('/').pop()}</td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-3 py-1 rounded-full bg-gray-100 font-bold text-sm ${scoreColor}">
                            ${s.score}/${s.totalQuestions} (${percent}%)
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
    }

    window.viewDetails = (id) => {
        const s = submissions.find(x => x.id === id);
        if (!s) return;

        modalStudentName.innerText = s.studentName;
        modalLessonTitle.innerText = `${s.lessonTitle.split('/').pop()} - Lớp ${s.studentClass} - Khối ${s.grade}`;
        
        const scorePercent = Math.round(s.score / s.totalQuestions * 100);
        const scoreColorClass = scorePercent >= 80 ? 'bg-green-50 border-green-100 text-green-800' : (scorePercent >= 50 ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-red-50 border-red-100 text-red-800');

        let html = `
            <div class="${scoreColorClass} p-6 rounded-3xl border mb-6 flex justify-between items-center">
                <div>
                    <div class="text-xs font-bold uppercase tracking-widest opacity-60">Kết quả tổng quát</div>
                    <div class="text-3xl font-black">${s.score} / ${s.totalQuestions} (${scorePercent}%)</div>
                </div>
                <div class="text-4xl">
                    ${scorePercent >= 80 ? '🌟' : (scorePercent >= 50 ? '👍' : '📚')}
                </div>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Chi tiết câu trả lời</div>
                    <div class="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">Sắp xếp theo thứ tự câu hỏi</div>
                </div>
        `;

        if (s.quizDetails && Array.isArray(s.quizDetails)) {
            s.quizDetails.forEach((item) => {
                const isCorrect = item.isCorrect;
                const statusColor = isCorrect ? 'border-green-200' : (item.selected ? 'border-red-200' : 'border-gray-200');
                const statusIcon = isCorrect ? '✅' : (item.selected ? '❌' : '⚪');
                
                html += `
                    <div class="bg-white p-4 rounded-2xl border ${statusColor} shadow-sm space-y-2">
                        <div class="flex justify-between items-start gap-3">
                            <span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0">CÂU ${item.qNum}</span>
                            <p class="text-sm font-semibold text-slate-800 flex-grow">${item.qText || 'Đang cập nhật nội dung câu hỏi...'}</p>
                            <span class="shrink-0">${statusIcon}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-50">
                            <div>
                                <div class="text-[10px] text-gray-400 uppercase font-bold">Học sinh chọn</div>
                                <div class="text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-slate-700'}">${item.answerText || item.selected || 'N/A'}</div>
                            </div>
                            ${!isCorrect ? `
                            <div>
                                <div class="text-[10px] text-gray-400 uppercase font-bold">Đáp án đúng</div>
                                <div class="text-sm font-bold text-blue-600">${item.correctAnswer?.toUpperCase() || 'N/A'}</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        } else if (s.details) {
            // Legacy support
            html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-2">';
            Object.entries(s.details).forEach(([key, val]) => {
                html += `
                    <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-500">${key.toUpperCase()}</span>
                        <span class="text-sm font-bold text-slate-700">${val.toUpperCase()}</span>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<p class="text-sm text-gray-400 italic text-center py-10">Không có dữ liệu chi tiết cho bài làm này.</p>';
        }

        html += '</div>';
        modalContent.innerHTML = html;
        detailModal.classList.remove('hidden');
    };

    window.deleteSubmission = async (id) => {
        if (confirm("Chắc chắn muốn xóa kết quả này?")) {
            try {
                await deleteDoc(doc(db, "submissions", id));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Xóa thất bại. Kiểm tra quyền truy cập.");
            }
        }
    };

    gradeFilter.onchange = render;
    classFilter.onchange = render;
    searchInput.oninput = render;
}

init();
