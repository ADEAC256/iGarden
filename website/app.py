# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify
from flask_cors import CORS, cross_origin
import json
import requests
from functions import extract_keywords

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/")
def connexion():
    return render_template('index.html')

@app.route('/dashboard/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/about/')
def about():
    return render_template('about.html')

@app.route('/index/')
def index():
    return render_template('index.html')

@app.route('/checkout/')
def checkout():
    return render_template('checkout.html')

@app.route('/contact/')
def contact():
    return render_template('contact.html')

@app.route('/portfolio/')
def portfolio():
    return render_template('portfolio.html')

@app.route('/data/')
def data():
    return render_template('data.html')

@app.route('/dashboard_template0/')
def dashboard_template0():
    return render_template('dashboard_template.html')

@app.route('/dashboard_template1/')
def dashboard_template1():
    return render_template('dashboard_template1.html')

@app.route('/creation_compte/')
def creation_compte():
    return render_template('creation_compte.html')


@app.route('/api/meteo')
def meteo():
    response = requests.get(METEO_API_URL)
    content = json.loads(response.content.decode('utf-8'))

    if response.status_code != 200:
        return jsonify({
            'status': 'error',
            'message': 'La requête à l\'API météo n\'a pas fonctionné. Voici le message renvoyé par l\'API : {}'.format(content['message'])
        }), 500

    data = []

    for prev in content["list"]:
        datetime = prev['dt'] * 1000 # conversion du timestamp en millisecondes
        temperature = prev['main']['temp'] - 273.15 # Conversion de Kelvin en °c
        temperature = round(temperature, 2) # Arrondi
        data.append([datetime, temperature])

    return jsonify({
      'status': 'ok', 
      'data': data
    })

@app.route('/api/values')
def values():
    response = requests.get("http://3a43-37-172-131-208.ngrok.io/api/device")
    content = json.loads(response.content.decode('utf-8'))
    return jsonify({
      'status': 'ok', 
      'val': content["val"]
    })


if __name__ == "__main__":
    app.run(debug=True)