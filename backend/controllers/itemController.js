
const db = require('../config/db');


const getItems = async (req, res, next) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

const getItem = async (req, res, next) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ item: items[0] });
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a title' });
    }

    const validStatuses = ['active', 'pending', 'completed'];
    const itemStatus = validStatuses.includes(status) ? status : 'active';

    const [result] = await db.query(
      'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description || null, itemStatus]
    );

 
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Item created successfully',
      item: items[0]
    });
  } catch (error) {
    next(error);
  }
};


const updateItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    
    const [existing] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Please provide a title' });
    }

    const validStatuses = ['active', 'pending', 'completed'];
    const itemStatus = validStatuses.includes(status) ? status : existing[0].status;

    await db.query(
      'UPDATE items SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description || null, itemStatus, req.params.id, req.user.id]
    );


    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Item updated successfully',
      item: items[0]
    });
  } catch (error) {
    next(error);
  }
};


const deleteItem = async (req, res, next) => {
  try {
  
    const [existing] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await db.query(
      'DELETE FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM items WHERE user_id = ?',
      [req.user.id]
    );

    const [statusCounts] = await db.query(
      'SELECT status, COUNT(*) as count FROM items WHERE user_id = ? GROUP BY status',
      [req.user.id]
    );

    const stats = {
      total: total[0].count,
      active: 0,
      pending: 0,
      completed: 0
    };

    statusCounts.forEach(row => {
      stats[row.status] = row.count;
    });

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getStats };
