/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Leaf, 
  Snowflake, 
  Sun, 
  FileCode, 
  FlaskConical, 
  Star, 
  Trophy, 
  Mail, 
  Phone, 
  University,
  ChevronRight,
  UserCircle,
  Users,
  GraduationCap,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lesson {
  title: string;
  href: string;
  type: 'foundation' | 'comprehensive';
}

interface Topic {
  level: number;
  grade: number;
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  hk1: Lesson[];
  hk2: Lesson[];
}

const topics: Topic[] = [
  {
    level: 1,
    grade: 3,
    title: "IC3 Spark Level 1 - Lớp 3",
    colorClass: "bg-[#27ae60]",
    icon: <Leaf className="w-6 h-6" />,
    hk1: [
      { title: "Kiến thức nền tảng - Phần 1.1", href: "/lop 3/level1_p1.1.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 1.2", href: "/lop 3/level1_p1.2.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 2.1", href: "/lop 3/level1_p2.1.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 2.2", href: "/lop 3/level1_p2.2.html", type: 'foundation' },
    ],
    hk2: [
      { title: "Kiến thức tổng hợp - Phần 1.1", href: "/lop 3/level1_hk2-p1.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 1.2", href: "/lop 3/level1_hk2-p1.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 2.1", href: "/lop 3/level1_hk2-p2.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 2.2", href: "/lop 3/level1_hk2-p2.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 3.1", href: "/lop 3/level1_hk2-p3.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 3.2", href: "/lop 3/level1_hk2-p3.2.html", type: 'comprehensive' },
    ]
  },
  {
    level: 2,
    grade: 4,
    title: "IC3 Spark Level 2 - Lớp 4",
    colorClass: "bg-[#f39c12]",
    icon: <Star className="w-6 h-6" />,
    hk1: [
      { title: "Kiến thức nền tảng - Phần 1.1", href: "/lop 4/level2_p1.1.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 1.2", href: "/lop 4/level2_p1.2.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 2.1", href: "/lop 4/level2_p2.1.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 2.2", href: "/lop 4/level2_p2.2.html", type: 'foundation' },
    ],
    hk2: [
      { title: "Kiến thức tổng hợp - Phần 1.1", href: "/lop 4/level2_hk2-p1.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 1.2", href: "/lop 4/level2_hk2-p1.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 2.1", href: "/lop 4/level2_hk2-p2.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 2.2", href: "/lop 4/level2_hk2-p2.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 3.1", href: "/lop 4/level2_hk2-p3.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 3.2", href: "/lop 4/level2_hk2-p3.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 4.1", href: "/lop 4/level2_hk2-p4.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 4.2", href: "/lop 4/level2_hk2-p4.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 5", href: "/lop 4/level2_hk2-p5.html", type: 'comprehensive' },
    ]
  },
  {
    level: 3,
    grade: 5,
    title: "IC3 Spark Level 3 - Lớp 5",
    colorClass: "bg-[#8e44ad]",
    icon: <Trophy className="w-6 h-6" />,
    hk1: [
      { title: "Kiến thức nền tảng - Phần 1.1", href: "/lop 5/level3_p1.1.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 1.2", href: "/lop 5/level3_p1.2.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 2.1", href: "/lop 5/level3_p2.1.html", type: 'foundation' },
      { title: "Kiến thức nền tảng - Phần 2.2", href: "/lop 5/level3_p2.2.html", type: 'foundation' },
    ],
    hk2: [
      { title: "Kiến thức tổng hợp - Phần 1.1", href: "/lop 5/level3_hk2-p1.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 1.2", href: "/lop 5/level3_hk2-p1.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 2.1", href: "/lop 5/level3_hk2-p2.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 2.2", href: "/lop 5/level3_hk2-p2.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 3.1", href: "/lop 5/level3_hk2-p3.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 3.2", href: "/lop 5/level3_hk2-p3.2.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 4.1", href: "/lop 5/level3_hk2-p4.1.html", type: 'comprehensive' },
      { title: "Kiến thức tổng hợp - Phần 4.2", href: "/lop 5/level3_hk2-p4.2.html", type: 'comprehensive' },
    ]
  }
];

export default function App() {
  const [studentInfo, setStudentInfo] = useState<{name: string, class: string, grade: number} | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [gradeInput, setGradeInput] = useState<number>(3);

  useEffect(() => {
    const saved = localStorage.getItem('ic3_student_info');
    if (saved) {
      setStudentInfo(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !classInput.trim()) return;
    
    const info = {
      name: nameInput.trim(),
      class: classInput.trim(),
      grade: gradeInput
    };
    setStudentInfo(info);
    localStorage.setItem('ic3_student_info', JSON.stringify(info));
  };

  const logout = () => {
    setStudentInfo(null);
    localStorage.removeItem('ic3_student_info');
  };

  const filteredTopics = topics.filter(t => t.grade === studentInfo?.grade);

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1e3c72] to-[#2a5298] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-b-8 border-[#ffcc00]"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-[#4CAF50] p-4 rounded-2xl shadow-lg">
              <UserCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-[#333] mb-2">Chào mừng các em!</h2>
          <p className="text-center text-gray-500 mb-8 text-sm italic">Vui lòng điền thông tin để bắt đầu ôn luyện</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1e3c72]" /> Họ tên học sinh
              </label>
              <input 
                type="text" 
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#eee] focus:border-[#3498db] outline-none transition-all placeholder:text-gray-300"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1e3c72]" /> Lớp
              </label>
              <input 
                type="text" 
                required
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#eee] focus:border-[#3498db] outline-none transition-all placeholder:text-gray-300"
                placeholder="Ví dụ: 3A"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#1e3c72]" /> Khối lớp
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[3, 4, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeInput(g)}
                    className={`py-3 rounded-xl font-bold transition-all border-2 ${
                      gradeInput === g 
                      ? "bg-[#3498db] border-[#3498db] text-white shadow-md scale-105" 
                      : "bg-white border-[#eee] text-gray-500 hover:border-[#3498db]"
                    }`}
                  >
                    Khối {g}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-linear-to-r from-[#1e3c72] to-[#2a5298] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <LogIn className="w-5 h-5" /> XÁC NHẬN VÀO HỌC
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <a href="/admin.html" className="text-xs text-[#1e3c72] hover:underline flex items-center gap-1 font-medium italic">
              <ShieldCheck className="w-3 h-3" /> Quản lý (Dành cho Giáo viên)
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      {/* HEADER */}
      <header className="bg-linear-to-br from-[#1e3c72] to-[#2a5298] text-white py-6 px-[5%] flex flex-col md:flex-row justify-between items-center shadow-lg border-b-6 border-[#ffcc00]">
        <div className="flex items-center font-kanit italic font-extrabold tracking-tighter select-none">
          <h1 className="flex items-center">
            <span className="text-[3rem] text-[#4CAF50] [text-shadow:1px_1px_0_#fff,-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff]">I</span>
            <span className="text-[3rem] text-[#4CAF50] [text-shadow:1px_1px_0_#fff,-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff] mr-1">C</span>
            <span className="text-[3.3rem] text-white mr-2">3</span>
            <span className="text-[2.5rem] text-[#333] tracking-normal not-italic">spark</span>
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-sm text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 text-sm">
               <div className="bg-[#4CAF50] w-2 h-2 rounded-full animate-pulse"></div>
               <span className="font-bold">{studentInfo.name} - Lớp {studentInfo.class}</span>
            </div>
            <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Đang trực tuyến</p>
          </div>
          <button 
            onClick={logout}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/30"
          >
            ĐỔI THÔNG TIN
          </button>
        </div>
      </header>

      {/* STUDENT WELCOME BANNER */}
      <div className="bg-white border-b border-[#ddd] py-4 px-5">
        <div className="container mx-auto max-w-[1250px] flex items-center gap-3">
          <div className="bg-[#1e3c72] text-white p-2 rounded-lg">
             <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e3c72]">CHƯƠNG TRÌNH ÔN LUYỆN KHỐI {studentInfo.grade}</h2>
            <p className="text-xs text-gray-500">Hệ thống tổng hợp bài thi IC3 Spark Level {studentInfo.grade - 2}</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto max-w-[1400px] my-10 px-6">
        <div className="flex flex-col gap-10">
          {filteredTopics.map((topic, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden flex flex-col"
            >
              {/* TOPIC HEADER */}
              <div className={`${topic.colorClass} p-8 text-white relative overflow-hidden`}>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                      {topic.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">{topic.title}</h2>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wider mt-1">Học phần tập trung lớp {studentInfo.grade}</p>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                     <GraduationCap className="w-16 h-16 opacity-20 rotate-12" />
                  </div>
                </div>
                {/* Visual decoration */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              {/* SEMESTERS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 italic font-medium">
                
                {/* HK1 COLUMN */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-full text-blue-700 border border-blue-100 shadow-sm not-italic font-bold">
                      <Snowflake className="w-5 h-5" /> HỌC KỲ I
                    </div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{topic.hk1.length} Bài ôn</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topic.hk1.map((lesson, lIdx) => (
                      <a 
                        key={lIdx}
                        href={`${lesson.href}?name=${encodeURIComponent(studentInfo.name)}&class=${encodeURIComponent(studentInfo.class)}&grade=${studentInfo.grade}`} 
                        className="group flex flex-col p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 border border-transparent hover:border-blue-200 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <FileCode className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-all translate-x-0 group-hover:translate-x-1" />
                        </div>
                        <span className="text-[14px] leading-tight text-slate-700 font-bold group-hover:text-blue-700 transition-colors">{lesson.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* HK2 COLUMN */}
                <div className="p-8 bg-orange-50/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 px-6 py-2 bg-orange-50 rounded-full text-orange-700 border border-orange-100 shadow-sm not-italic font-bold">
                      <Sun className="w-5 h-5" /> HỌC KỲ II
                    </div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{topic.hk2.length} Bài ôn</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topic.hk2.map((lesson, lIdx) => (
                      <a 
                        key={lIdx}
                        href={`${lesson.href}?name=${encodeURIComponent(studentInfo.name)}&class=${encodeURIComponent(studentInfo.class)}&grade=${studentInfo.grade}`} 
                        className="group flex flex-col p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <FlaskConical className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-all translate-x-0 group-hover:translate-x-1" />
                        </div>
                        <span className="text-[14px] leading-tight text-slate-700 font-bold group-hover:text-orange-700 transition-colors">{lesson.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-linear-to-br from-[#1e3c72] to-[#2a5298] text-white py-6 px-5 text-center border-t-6 border-[#ffcc00]">
        <div className="max-w-[800px] mx-auto">
          <h3 className="text-lg font-bold mb-1 tracking-wide">HỆ THỐNG HỖ TRỢ HỌC TẬP IC3 SPARK</h3>
          <p className="opacity-80 mb-4 text-sm">© 2026 Bản quyền thuộc về GV. Nguyễn Đình Bạch Long</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="flex flex-col items-center gap-1">
              <Mail className="w-4 h-4" />
              <span className="text-xs">dinhlongcntt20119@gmail.com</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Phone className="w-4 h-4" />
              <span className="text-xs">0937.438.939</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <University className="w-4 h-4" />
              <span className="text-xs">Vietinbank: 0937438939</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
