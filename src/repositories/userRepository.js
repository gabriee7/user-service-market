import pool from '#config/database.js';

const TABLE_NAME = 'users';

const userRepository = {
  async create({ id, name, email, password }) {
    const sql = `INSERT INTO ${TABLE_NAME} (id, name, email, password) VALUES (?, ?, ?, ?)`;
    const params = [id, name, email, password];
    await pool.execute(sql, params);
    const [rows] = await pool.execute(`SELECT * FROM ${TABLE_NAME} WHERE id = ? LIMIT 1`, [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE email = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  },

  async getByEmail(email) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE email = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  },

  async getById(id) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE id = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async getAll() {
    const sql = `SELECT * FROM ${TABLE_NAME}`;
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async update(id, { name, email, password }) {
    const sql = `UPDATE ${TABLE_NAME} SET name = ?, email = ?, password = ? WHERE id = ?`;
    await pool.execute(sql, [name, email, password, id]);
    const [rows] = await pool.execute(`SELECT * FROM ${TABLE_NAME} WHERE id = ? LIMIT 1`, [id]);
    return rows[0] || null;
  },

  async delete(id) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;
    await pool.execute(sql, [id]);
    return;
  }
};

export default userRepository;