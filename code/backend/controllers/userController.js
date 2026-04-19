// User Controller

const getProfile = (req, res) => {
    res.json({ message: 'Get user profile' });
};

const updateProfile = (req, res) => {
    res.json({ message: 'Update user profile' });
};

const getAllUsers = (req, res) => {
    res.json({ message: 'Get all users' });
};

const toggleUserStatus = (req, res) => {
    res.json({ message: 'Toggle user status' });
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    toggleUserStatus
};
