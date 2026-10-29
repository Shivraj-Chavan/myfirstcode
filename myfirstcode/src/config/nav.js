import {
  LayoutDashboard,
  ClipboardList,
  HelpCircle,
  BookOpen,
  TerminalSquare,
  Trophy,
  CalendarDays,
  MessageCircle,
  Award,
  Users,
  GraduationCap,
} from "lucide-react";

export const studentNav = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/student/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/student/quizzes", label: "Quizzes", icon: HelpCircle },
  { to: "/student/courses", label: "Courses", icon: BookOpen },
  // { to: "/student/levels", label: "My Levels", icon: BookOpen },
  { to: "/student/playground", label: "Code Playground", icon: TerminalSquare },
  { to: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/student/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/student/enquiries", label: "Ask a Teacher", icon: MessageCircle },
  { to: "/student/certificates", label: "Certificates", icon: Award },
];

export const teacherNav = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/teacher/students", label: "My Students", icon: Users },
  { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/teacher/quizzes", label: "Quizzes", icon: HelpCircle },
  { to: "/teacher/levels", label: "Course Levels", icon: BookOpen },
  { to: "/teacher/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/teacher/certificates", label: "Certificates", icon: Award },
  { to: "/teacher/enquiries", label: "Enquiries", icon: MessageCircle },
];

export const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/calendar", label: "Calendar", icon: CalendarDays },
   { to: "/admin/certificates", label: "Certificates", icon: Award },
   { to: "/admin/enquiries", label: "Enquiries", icon: MessageCircle },
  { to: "/admin/referral-partners", label: "Referral Partners", icon: GraduationCap },
  { to: "/admin/referral-students", label: "Referred Students", icon: Users },

];
