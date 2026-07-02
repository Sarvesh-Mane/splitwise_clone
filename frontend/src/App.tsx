import {BrowserRouter, Route, Routes} from "react-router-dom";

import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
    return (
        //Auth context should be passed all over the react app, so it is enclosing everything
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>

                    {/* Protected routes */}
                    <Route element={
                        <ProtectedRoute>
                            <Layout/>
                        </ProtectedRoute>
                    }>
                        <Route path="/" element={<DashboardPage/>}/>
                        <Route path="/groups" element={<GroupsPage/>}/>
                        <Route path="/groups/:id" element={<GroupDetailPage/>}/>
                        <Route path="/expenses/:id" element={<ExpenseDetailPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}


export default App;