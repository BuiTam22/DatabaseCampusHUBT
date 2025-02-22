import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Chip,
    Avatar,
    LinearProgress,
    InputAdornment
} from '@mui/material';
import {
    Lock as LockIcon,
    LockOpen as UnlockIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadUsers();
            return;
        }
        
        setLoading(true);
        try {
            const results = await adminService.searchUsers(searchQuery);
            setUsers(results);
        } catch (error) {
            console.error('Error searching users:', error);
        }
        setLoading(false);
    };

    const handleLockAccount = async (userId) => {
        try {
            await adminService.lockUserAccount(userId);
            loadUsers();
        } catch (error) {
            console.error('Error locking account:', error);
        }
    };

    const handleUnlockAccount = async (userId) => {
        try {
            await adminService.unlockUserAccount(userId);
            loadUsers();
        } catch (error) {
            console.error('Error unlocking account:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'LOCKED':
                return 'error';
            case 'PENDING':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getRoleIcon = (role) => {
        return role === 'ADMIN' ? <AdminIcon color="primary" /> : <PersonIcon />;
    };

    return (
        <AdminLayout>
            <Box sx={{ 
                maxWidth: 1200, 
                margin: '0 auto',
                padding: 3
            }}>
                {/* Stats Cards */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 3,
                    mb: 4 
                }}>
                    <Card sx={{ bgcolor: 'primary.light' }}>
                        <CardContent>
                            <Typography color="white" variant="h6">Total Users</Typography>
                            <Typography color="white" variant="h3">{users.length}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ bgcolor: 'success.light' }}>
                        <CardContent>
                            <Typography color="white" variant="h6">Active Users</Typography>
                            <Typography color="white" variant="h3">
                                {users.filter(u => u.accountStatus === 'ACTIVE').length}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ bgcolor: 'error.light' }}>
                        <CardContent>
                            <Typography color="white" variant="h6">Locked Accounts</Typography>
                            <Typography color="white" variant="h3">
                                {users.filter(u => u.accountStatus === 'LOCKED').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Search Section */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                label="Search users"
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{ height: 56 }}
                            >
                                Search
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: 3 }}>User Management</Typography>
                        {loading && <LinearProgress sx={{ mb: 2 }} />}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow 
                                            key={user.id}
                                            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar src={user.image}>
                                                        {user.fullName?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {user.fullName}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            @{user.username}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getRoleIcon(user.role)}
                                                    <Typography>{user.role}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.accountStatus}
                                                    color={getStatusColor(user.accountStatus)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {user.accountStatus === 'ACTIVE' ? (
                                                    <Tooltip title="Lock Account">
                                                        <IconButton 
                                                            onClick={() => handleLockAccount(user.id)}
                                                            color="warning"
                                                            size="small"
                                                        >
                                                            <LockIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Unlock Account">
                                                        <IconButton 
                                                            onClick={() => handleUnlockAccount(user.id)}
                                                            color="success"
                                                            size="small"
                                                        >
                                                            <UnlockIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </AdminLayout>
    );
};

export default UserManagement; 