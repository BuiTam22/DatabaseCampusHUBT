import axios from '../utils/axios';

class AdminService {
    async getAllUsers() {
        try {
            const response = await axios.get('/admin/users');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async lockUserAccount(userId, reason) {
        try {
            const response = await axios.post(`/admin/users/${userId}/lock`, null, {
                params: { reason }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async unlockUserAccount(userId) {
        try {
            const response = await axios.post(`/admin/users/${userId}/unlock`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async searchUsers(query) {
        try {
            const response = await axios.get(`/admin/users/search`, {
                params: { query }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new AdminService(); 