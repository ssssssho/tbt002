from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from login_api import auth_login


app = Flask(__name__)
CORS(app)

# DB接続
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="tbtadmin",
    database="tbt002"
)
cursor = conn.cursor()


# Blueprint を登録
app.register_blueprint(auth_login)


@app.route("/todos", methods=["POST"])
def add_todo():
    data = request.json
    text = data.get("text")
    date = data.get("date")

    cursor.execute(
        "INSERT INTO task (text, date, done) VALUES (%s, %s, %s)",
        (text, date, False)
    )
    conn.commit()
    return jsonify({"message": "Todo added!"}), 201


@app.route("/get_tasks", methods=["GET"])
def get_tasks():
    cursor.execute("SELECT id, text, date, done FROM task ORDER BY date DESC")
    rows = cursor.fetchall()
    tasks = [
        {"id": row[0], "text": row[1], "date": str(row[2]), "done": row[3]}
        for row in rows
    ]
    return jsonify(tasks)


@app.route("/delete_tasks/<int:task_id>", methods=["DELETE"])
def delete_tasks(task_id):
    cursor.execute("DELETE FROM task WHERE id = %s", (task_id,))
    conn.commit()

    return jsonify({"message": "削除完了", "id": task_id})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)