import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Forbidden from './pages/Forbidden';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssignments from './pages/StudentAssignments';
import StudentAssignmentDetail from './pages/StudentAssignmentDetail';
import StudentSubmissions from './pages/StudentSubmissions';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherAssignmentDetail from './pages/TeacherAssignmentDetail';
import { ROLES } from './utils/constants';
import { useAuth } from './context';

function HomeRedirect(){const {profile}=useAuth();return <Navigate to={profile?.role===ROLES.TEACHER?'/teacher':'/student'} replace/>}
export default function App(){return <Routes><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forbidden" element={<Forbidden/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route index element={<HomeRedirect/>}/><Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}/>}><Route path="student" element={<StudentDashboard/>}/><Route path="student/assignments" element={<StudentAssignments/>}/><Route path="student/assignments/:id" element={<StudentAssignmentDetail/>}/><Route path="student/submissions" element={<StudentSubmissions/>}/></Route><Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]}/>}><Route path="teacher" element={<TeacherDashboard/>}/><Route path="teacher/assignments" element={<TeacherAssignments/>}/><Route path="teacher/assignments/:id" element={<TeacherAssignmentDetail/>}/></Route></Route></Route></Routes>}
