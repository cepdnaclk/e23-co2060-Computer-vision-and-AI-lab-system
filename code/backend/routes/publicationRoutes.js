// backend/routes/publicationRoutes.js
const router = require('express').Router()
const { getPublications, getYears, getById, create, update, remove } = require('../controllers/publicationController')
const { protect, isStaff, isAdmin } = require('../middleware/authMiddleware')

router.get('/',       getPublications)   // public
router.get('/years',  getYears)          // public
router.get('/:id',    getById)           // public
router.post('/',      protect, isStaff,  create)
router.patch('/:id',  protect, isStaff,  update)
router.delete('/:id', protect, isAdmin,  remove)

module.exports = router