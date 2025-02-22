import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotFound from '../error/NotFound';

const AdminRoute = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    
    // Nếu chưa đăng nhập, chuyển về trang login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Kiểm tra nghiêm ngặt quyền admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return <NotFound />;
    }

    return children;
};

export default AdminRoute; 