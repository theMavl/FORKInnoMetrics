import api.app
import os

#print("NEOK")


if not os.path.exists('logs'):
    os.makedirs('logs')

api.app.entry()

