import AdminPage from '../pages/admin/AdminPage';

// ... existing imports ...

const routes = [
    // ... existing routes ...
    {
        path: '/admin',
        element: (
            <PrivateRoute>
                <AdminLayout>
                    <AdminPage />
                </AdminLayout>
            </PrivateRoute>
        )
    }
]; 