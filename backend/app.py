from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
import sqlite3
from datetime import datetime
import base64

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
def init_db():
    conn = sqlite3.connect("database_deriv.db")
    c = conn.cursor()

    # Create tables if they don't exist
    c.execute("""CREATE TABLE IF NOT EXISTS users (
                 id INTEGER PRIMARY KEY, 
                 email TEXT UNIQUE NOT NULL, 
                 user_type TEXT NOT NULL)""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS chat_messages (
                 id INTEGER PRIMARY KEY, 
                 sender_id INTEGER NOT NULL, 
                 content TEXT NOT NULL, 
                 message_type TEXT NOT NULL, 
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                 FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE)""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS chat_files (
                 id INTEGER PRIMARY KEY, 
                 sender_id INTEGER NOT NULL, 
                 file_name TEXT NOT NULL, 
                 file_type TEXT NOT NULL, 
                 file_data TEXT NOT NULL, 
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                 FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE)""")
    
    conn.commit()
    conn.close()

@app.route("/api/auth", methods=["POST"])
def auth():
    data = request.json
    conn = sqlite3.connect("database_deriv.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO users (email, user_type) VALUES (?, ?)",
        (data["email"], data["userType"]),
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

# Socket.IO events
@socketio.on("join-chatroom")
def on_join():
    join_room("default_chatroom")
    # Load existing messages
    conn = sqlite3.connect("database_deriv.db")
    c = conn.cursor()
    c.execute("SELECT * FROM chat_messages")
    messages = c.fetchall()
    conn.close()
    emit("message-history", messages, room="default_chatroom")

@socketio.on("send-message")
def on_message(data):
    conn = sqlite3.connect("database_deriv.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO chat_messages (sender_id, content, message_type, created_at)
                 VALUES (?, ?, ?, ?)""",
        (data["senderId"], data["content"], data["messageType"], datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()
    
    emit("message", data, room="default_chatroom")

@socketio.on("send-file")
def on_file_upload(data):
    sender_id = data["senderId"]
    file_name = data["fileName"]
    file_type = data["fileType"]
    file_data = data["fileData"]  # Base64 encoded file
    
    conn = sqlite3.connect("database_deriv.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO chat_files (sender_id, file_name, file_type, file_data, created_at)
                 VALUES (?, ?, ?, ?, ?)""",
        (sender_id, file_name, file_type, file_data, datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()
    
    emit("file-received", {"senderId": sender_id, "fileName": file_name, "fileType": file_type}, room="default_chatroom")

if __name__ == "__main__":
    init_db()
    socketio.run(app, debug=True)