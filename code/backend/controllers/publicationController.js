// backend/controllers/publicationController.js
const { query } = require('../config/db')

// GET /api/publications  — public, supports search, year, tag filters
const getPublications = async (req, res) => {
  try {
    const { search, year, tag, limit = 50, offset = 0 } = req.query

    let sql = `SELECT * FROM publications WHERE 1=1`
    const params = []

    if (search) {
      params.push(`%${search}%`)
      sql += ` AND (title ILIKE $${params.length} OR abstract ILIKE $${params.length})`
    }
    if (year) {
      params.push(parseInt(year))
      sql += ` AND year = $${params.length}`
    }
    if (tag) {
      params.push(tag)
      sql += ` AND $${params.length} = ANY(tags)`
    }

    // Count total (for pagination)
    const countRes = await query(sql.replace('SELECT *', 'SELECT COUNT(*)'), params)
    const total = parseInt(countRes.rows[0].count)

    params.push(parseInt(limit))
    params.push(parseInt(offset))
    sql += ` ORDER BY year DESC, created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`

    const { rows } = await query(sql, params)

    res.json({ total, publications: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/publications/years  — distinct years for filter dropdown
const getYears = async (req, res) => {
  try {
    const { rows } = await query(`SELECT DISTINCT year FROM publications ORDER BY year DESC`)
    res.json(rows.map(r => r.year))
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/publications/:id
const getById = async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM publications WHERE id=$1`, [req.params.id])
    if (!rows.length) return res.status(404).json({ message: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/publications  — staff only
const create = async (req, res) => {
  try {
    const { title, authors, venue, year, doi, pdf_url, abstract, tags } = req.body
    const { rows } = await query(
      `INSERT INTO publications(title, authors, venue, year, doi, pdf_url, abstract, tags)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, authors, venue, parseInt(year), doi, pdf_url, abstract, tags || []]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /api/publications/:id  — staff only
const update = async (req, res) => {
  try {
    const fields = ['title', 'authors', 'venue', 'year', 'doi', 'pdf_url', 'abstract', 'tags']
    const updates = []
    const params  = []
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        params.push(req.body[f])
        updates.push(`${f}=$${params.length}`)
      }
    })
    if (!updates.length) return res.status(400).json({ message: 'Nothing to update' })
    params.push(req.params.id)
    const { rows } = await query(
      `UPDATE publications SET ${updates.join(',')} WHERE id=$${params.length} RETURNING *`,
      params
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/publications/:id  — admin only
const remove = async (req, res) => {
  try {
    await query(`DELETE FROM publications WHERE id=$1`, [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getPublications, getYears, getById, create, update, remove }