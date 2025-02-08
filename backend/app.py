from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
from datetime import datetime
import sqlite3
from flask_cors import CORS

app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)
# Database setup
def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # Create tables if they don't exist
    c.execute("""CREATE TABLE IF NOT EXISTS editor_content
                 (id INTEGER PRIMARY KEY, project_id INTEGER, 
                  content TEXT, updated_at TIMESTAMP)""")
    c.execute("""CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, email TEXT, user_type TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS projects
                 (id INTEGER PRIMARY KEY, title TEXT, description TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS messages
                 (id INTEGER PRIMARY KEY, project_id INTEGER, user_id INTEGER, 
                  content TEXT, type TEXT, created_at TIMESTAMP)""")
    c.execute("""
        CREATE TABLE IF NOT EXISTS dispute_forms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            file BLOB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


@app.route("/api/create_project", methods=["POST"])
def create_project():
    data = request.json
    if not data or "title" not in data or "description" not in data:
        return jsonify({"status": "error", "message": "Missing title or description"}), 400

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO projects (title, description) VALUES (?, ?)",
        (data["title"], data["description"]),
    )
    conn.commit()
    project_id = c.lastrowid
    conn.close()

    return jsonify({"status": "success", "project_id": project_id}), 201

@app.route("/api/auth", methods=["POST"])
def auth():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO users (email, user_type) VALUES (?, ?)",
        (data["email"], data["userType"]),
    )
    user_id = c.lastrowid
    print(user_id)
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "user_id": user_id})


@app.route("/api/projects", methods=["GET"])
def get_projects():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM projects")
    projects = c.fetchall()
    conn.close()
    return jsonify([{"id": p[0], "title": p[1], "description": p[2]} for p in projects])

# Socket.IO events
@socketio.on("join-project")
def on_join(project_id):
    join_room(project_id)
    # Load existing messages
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM messages WHERE project_id = ?", (project_id,))
    messages = c.fetchall()
    # Load existing editor content
    c.execute("SELECT content FROM editor_content WHERE project_id = ? ORDER BY updated_at DESC LIMIT 1", (project_id,))
    editor_content = c.fetchone()
    conn.close()
    emit("message-history", messages, room=project_id)
    if editor_content:
        emit("editor-content", json.loads(editor_content[0]), room=project_id)

@socketio.on("send-message")
def on_message(data):
    print("Received message data:", data)  # Debugging: Check if userId exists in request

    user_id = data.get("userId")
    if not user_id:
        print("Error: userId is missing from the request")
        return

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    
    c.execute(
        """INSERT INTO messages (project_id, user_id, content, type, created_at)
           VALUES (?, ?, ?, ?, ?)""",
        (int(data["projectId"]), user_id, data["content"], data["type"], datetime.now().isoformat()),
    )

    conn.commit()
    conn.close()

    # Include userId in the emitted message
    emit("message", {**data, "userId": user_id}, room=data["projectId"])

@app.route("/api/get_user_id", methods=["GET"])
def get_user_id():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    result = c.fetchone()
    conn.close()

    if result:
        return jsonify({"userId": result[0]})
    else:
        return jsonify({"error": "User not found"}), 404
    
@app.route("/api/submit_dispute", methods=["POST"])
def submit_dispute():
    try:
        # Extract form fields (not JSON)
        name = request.form.get("name")
        phone = request.form.get("phone")
        category = request.form.get("category")
        description = request.form.get("description")
        file = request.files.get("file")  # File is inside `request.files`

        if not all([name, phone, category, description, file]):
            return jsonify({"status": "error", "message": "All fields are required"}), 400

        # Save file as binary data in the database
        file_data = file.read()

        conn = sqlite3.connect("database.db")
        c = conn.cursor()
        c.execute("""
            INSERT INTO dispute_forms (name, phone, category, description, file, created_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """, (name, phone, category, description, file_data))

        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Dispute submitted successfully!"}), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
if __name__ == "__main__":
    init_db()
    socketio.run(app, debug=True)
    app.run(debug=True, port=5000)