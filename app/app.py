from flask import Flask, request, jsonify, redirect, url_for
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

import json

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/pythonreactdb'
mongo = PyMongo(app)

CORS(app, support_credentials=True)
db = mongo.db.users

# Create an user
@app.route("/users/", methods=["POST"])
def createUser():
    id = db.insert({
        "name": request.json["name"],
        "email": request.json["email"],
        "password": request.json["password"]
    })
    return redirect(url_for('getUsers'))

# Get all users
@app.route("/users/", methods=["GET"])
def getUsers():
    users = []
    for user in db.find():
        users.append({
            '_id': str(ObjectId(user["_id"])),
            'name': user["name"],
            'email': user["email"],
            'password': user["password"]
        })
    return jsonify(users)

# Get an user by id
@app.route("/user/<id>", methods=["GET"])
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    })

# Delete User
@app.route("/user/<id>", methods=["DELETE"])
def deleteUser(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({
        "message": "user deleted"
    })

# Update user
@app.route("/user/<id>", methods=["PUT"])
def updateUser(id):
    db.find_one_and_update(
        {'_id': ObjectId(id)},
        {"$set": {
                    "name": request.json['name'],
                    "email": request.json['email'],
                    "password": request.json['password']
                }
        }
    )
    return jsonify({
        "message": "user updated"
    })

if __name__ == '__main__':
    app.run(debug=True)
    