import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    IconButton,
    Chip
} from '@mui/material';
import {
    Lock as LockIcon,
    LockOpen as UnlockIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminService from '../../services/adminService';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
}));

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openLockDialog, setOpenLockDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [lockReason, setLockReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await AdminService.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLockAccount = async () => {
        try {
            await AdminService.lockUserAccount(selectedUser.userID, lockReason);
            setOpenLockDialog(false);
            setLockReason('');
            fetchUsers(); // Refresh user list
        } catch (error) {
            setError('Failed to lock account');
            console.error('Error locking account:', error);
        }
    };

    const handleUnlockAccount = async (userId) => {
        try {
            await AdminService.unlockUserAccount(userId);
            fetchUsers(); // Refresh user list
        } catch (error) {
            setError('Failed to unlock account');
            console.error('Error unlocking account:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        // Implement search logic here
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>User Management</Typography>
            
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <TextField
                    placeholder="Search users..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" />
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>Full Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow key={user.userID}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.accountStatus}
                                            color={user.accountStatus === 'ACTIVE' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {user.accountStatus === 'ACTIVE' ? (
                                            <IconButton
                                                color="warning"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setOpenLockDialog(true);
                                                }}
                                            >
                                                <LockIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                color="success"
                                                onClick={() => handleUnlockAccount(user.userID)}
                                            >
                                                <UnlockIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />

            <Dialog open={openLockDialog} onClose={() => setOpenLockDialog(false)}>
                <DialogTitle>Lock Account</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to lock {selectedUser?.username}'s account?
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for locking"
                        fullWidth
                        multiline
                        rows={3}
                        value={lockReason}
                        onChange={(e) => setLockReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLockDialog(false)}>Cancel</Button>
                    <Button onClick={handleLockAccount} color="warning">Lock Account</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage; 