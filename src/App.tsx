/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

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
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-linear-to-br from-[#1e3c72] to-[#2a5298] text-white py-8 px-[5%] flex flex-col md:flex-row justify-between items-center shadow-lg border-b-6 border-[#ffcc00]">
        <div className="flex items-center font-kanit italic font-extrabold tracking-tighter select-none">
          <h1 className="flex items-center">
            <span className="text-[3.5rem] text-[#4CAF50] [text-shadow:1px_1px_0_#fff,-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff]">I</span>
            <span className="text-[3.5rem] text-[#4CAF50] [text-shadow:1px_1px_0_#fff,-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff] mr-1">C</span>
            <span className="text-[3.8rem] text-white mr-2">3</span>
            <span className="text-[3rem] text-[#333] tracking-normal not-italic">spark</span>
          </h1>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm text-center md:text-right mt-4 md:mt-0">
          <h2 className="text-xl font-bold mb-1">Hệ Thống Ôn Luyện Trực Tuyến</h2>
          <p className="flex items-center justify-center md:justify-end gap-2 opacity-90">
            <User className="w-4 h-4" /> GV. Nguyễn Đình Bạch Long
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto max-w-[1250px] my-10 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-[#e1e8ed] overflow-hidden flex flex-col"
            >
              <div className={`${topic.colorClass} p-5 text-white font-bold text-xl flex items-center gap-3`}>
                {topic.icon}
                {topic.title}
              </div>

              {/* HK1 */}
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2 px-5 py-2 bg-[#f8f9fa] rounded-full font-bold text-sm text-[#444] border border-[#eee] w-fit">
                  <Snowflake className="w-4 h-4 text-[#3498db]" /> HỌC KỲ I
                </div>
                <ul className="py-3 space-y-2">
                  {topic.hk1.map((lesson, lIdx) => (
                    <li key={lIdx}>
                      <a 
                        href={lesson.href} 
                        className="flex items-center p-3 rounded-lg text-[#444] hover:bg-[#f0f7ff] hover:translate-x-2 transition-all border border-transparent hover:border-[#3498db] hover:text-[#0056b3] group"
                      >
                        <FileCode className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* HK2 */}
              <div className="px-4 pb-4 flex-grow">
                <div className="flex items-center gap-2 px-5 py-2 bg-[#f8f9fa] rounded-full font-bold text-sm text-[#444] border border-[#eee] w-fit">
                  <Sun className="w-4 h-4 text-[#e74c3c]" /> HỌC KỲ II
                </div>
                <ul className="py-3 space-y-2">
                  {topic.hk2.map((lesson, lIdx) => (
                    <li key={lIdx}>
                      <a 
                        href={lesson.href} 
                        className="flex items-center p-3 rounded-lg text-[#444] hover:bg-[#f0f7ff] hover:translate-x-2 transition-all border border-transparent hover:border-[#3498db] hover:text-[#0056b3] group"
                      >
                        <FlaskConical className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
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
