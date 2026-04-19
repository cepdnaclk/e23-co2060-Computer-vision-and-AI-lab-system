// Equipment Controller

const getAllEquipment = (req, res) => {
    res.json({ message: 'Get all equipment' });
};

const getCategories = (req, res) => {
    res.json({ message: 'Get categories' });
};

const getEquipmentById = (req, res) => {
    res.json({ message: 'Get equipment by ID' });
};

const checkAvailability = (req, res) => {
    res.json({ message: 'Check availability' });
};

const createEquipment = (req, res) => {
    res.json({ message: 'Create equipment' });
};

const updateEquipment = (req, res) => {
    res.json({ message: 'Update equipment' });
};

module.exports = {
    getAllEquipment,
    getCategories,
    getEquipmentById,
    checkAvailability,
    createEquipment,
    updateEquipment
};
