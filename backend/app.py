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
    conn.commit()
    conn.close()

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "your-email@gmail.com"  # Replace with your email
SMTP_PASSWORD = "your-app-password"  # Replace with your app password

def send_meeting_email(recipient, meeting_time):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USERNAME
    msg["To"] = recipient
    msg["Subject"] = "Project Meeting Invitation"

    body = f"You have been invited to a project meeting at {meeting_time}"
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)

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
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

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
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO messages (project_id, content, type, created_at)
                 VALUES (?, ?, ?, ?)""",
        (data["projectId"], data["content"], data["type"], datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()
    emit("message", data, room=data["projectId"])

@socketio.on("schedule-meeting")
def on_schedule_meeting(data):
    # Get all users in the project and send email
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT email FROM users WHERE project_id = ?", (data["projectId"],))
    recipients = [row[0] for row in c.fetchall()]
    conn.close()

    for recipient in recipients:
        send_meeting_email(recipient, data["time"])

    emit(
        "meeting-scheduled",
        {"status": "success", "time": data["time"]},
        room=data["projectId"],
    )

@socketio.on("editor-update")
def on_editor_update(data):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO editor_content (project_id, content, updated_at)
                 VALUES (?, ?, ?)""",
        (data["projectId"], data["content"], datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()
    emit("editor-update", json.loads(data["content"]), room=data["projectId"])

if __name__ == "__main__":
    init_db()
    socketio.run(app, debug=True)