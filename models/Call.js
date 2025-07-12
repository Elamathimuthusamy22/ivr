const { pool } = require('../config/database');

class Call {
  static async create(callData) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        INSERT INTO calls (
          call_sid, from_number, to_number, call_status, 
          call_duration, recording_url, transcription, 
          user_input, menu_selection, language_selected,
          house_number, service_rating, rating_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        callData.callSid,
        callData.fromNumber,
        callData.toNumber,
        callData.callStatus,
        callData.callDuration || 0,
        callData.recordingUrl || null,
        callData.transcription || null,
        callData.userInput || null,
        callData.menuSelection || null,
        callData.languageSelected || null,
        callData.houseNumber || null,
        callData.serviceRating || null,
        callData.ratingText || null
      ];
      
      const [result] = await connection.execute(query, values);
      connection.release();
      
      return { id: result.insertId, ...callData };
    } catch (error) {
      console.error('Error creating call record:', error);
      throw error;
    }
  }

  static async findByCallSid(callSid) {
    try {
      const connection = await pool.getConnection();
      
      const query = 'SELECT * FROM calls WHERE call_sid = ?';
      const [rows] = await connection.execute(query, [callSid]);
      
      connection.release();
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding call by SID:', error);
      throw error;
    }
  }

  static async update(callSid, updateData) {
    try {
      const connection = await pool.getConnection();
      
      const fields = Object.keys(updateData)
        .map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`)
        .join(', ');
      
      const query = `UPDATE calls SET ${fields} WHERE call_sid = ?`;
      const values = [...Object.values(updateData), callSid];
      
      const [result] = await connection.execute(query, values);
      connection.release();
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating call:', error);
      throw error;
    }
  }

  static async getAll(limit = 50, offset = 0) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT * FROM calls 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      const [rows] = await connection.execute(query, [limit, offset]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Error getting all calls:', error);
      throw error;
    }
  }

  static async getCallStats() {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT 
          COUNT(*) as total_calls,
          COUNT(CASE WHEN call_status = 'completed' THEN 1 END) as completed_calls,
          COUNT(CASE WHEN call_status = 'no-answer' THEN 1 END) as no_answer_calls,
          COUNT(CASE WHEN call_status = 'busy' THEN 1 END) as busy_calls,
          AVG(call_duration) as avg_duration,
          SUM(call_duration) as total_duration
        FROM calls
      `;
      
      const [rows] = await connection.execute(query);
      connection.release();
      
      return rows[0];
    } catch (error) {
      console.error('Error getting call stats:', error);
      throw error;
    }
  }

  static async logEvent(callSid, eventType, eventData) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        INSERT INTO call_logs (call_sid, event_type, event_data) 
        VALUES (?, ?, ?)
      `;
      
      const values = [callSid, eventType, JSON.stringify(eventData)];
      
      const [result] = await connection.execute(query, values);
      connection.release();
      
      return result.insertId;
    } catch (error) {
      console.error('Error logging call event:', error);
      throw error;
    }
  }

  static async getCallLogs(callSid) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT * FROM call_logs 
        WHERE call_sid = ? 
        ORDER BY timestamp ASC
      `;
      
      const [rows] = await connection.execute(query, [callSid]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Error getting call logs:', error);
      throw error;
    }
  }
}

module.exports = Call; 