from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
from datetime import datetime
import sqlite3

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # Create tables if they don't exist
    c.execute("""CREATE TABLE IF NOT EXISTS users (
                 id INTEGER PRIMARY KEY, 
                 email TEXT UNIQUE NOT NULL, 
                 user_type TEXT NOT NULL)""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS chat_rooms (
                 id INTEGER PRIMARY KEY, 
                 buyer_id INTEGER NOT NULL, 
                 seller_id INTEGER NOT NULL, 
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                 FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE, 
                 FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE)""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS chat_messages (
                 id INTEGER PRIMARY KEY, 
                 chat_room_id INTEGER NOT NULL, 
                 sender_id INTEGER NOT NULL, 
                 content TEXT NOT NULL, 
                 message_type TEXT NOT NULL, 
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                 FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE, 
                 FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE)""")
    
    conn.commit()
    conn.close()

@app.route("/api/auth", methods=["POST"])
def auth():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO users (email, user_type) VALUES (?, ?)",
        (data["email"], data["userType"]),
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

@app.route("/api/create_chatroom", methods=["POST"])
def create_chatroom():
    data = request.json
    if not data or "buyer_id" not in data or "seller_id" not in data:
        return jsonify({"status": "error", "message": "Missing buyer or seller ID"}), 400

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO chat_rooms (buyer_id, seller_id) VALUES (?, ?)",
        (data["buyer_id"], data["seller_id"]),
    )
    conn.commit()
    chat_room_id = c.lastrowid
    conn.close()

    return jsonify({"status": "success", "chat_room_id": chat_room_id}), 201

# Socket.IO events
@socketio.on("join-chatroom")
def on_join(chat_room_id):
    join_room(chat_room_id)
    # Load existing messages
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM chat_messages WHERE chat_room_id = ?", (chat_room_id,))
    messages = c.fetchall()
    conn.close()
    emit("message-history", messages, room=chat_room_id)

@socketio.on("send-message")
def on_message(data):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO chat_messages (chat_room_id, sender_id, content, message_type, created_at)
                 VALUES (?, ?, ?, ?, ?)""",
        (data["chatRoomId"], data["senderId"], data["content"], data["messageType"], datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()
    emit("message", data, room=data["chatRoomId"])

if __name__ == "__main__":
    init_db()
    socketio.run(app, debug=True)