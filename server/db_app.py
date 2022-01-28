# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin
from flask_mail import Mail, Message

import json
import requests
import tinydb

db = tinydb.TinyDB('db_storage.json')

app = Flask(__name__)
cors = CORS(app,support_credentials=True)
app.config['CORS_HEADERS'] = 'application/json'

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'igarden.eise@gmail.com',
    "MAIL_PASSWORD": '#Polytech21'
}

app.config.update(mail_settings)
mail = Mail(app)


@app.route("/",methods = ['POST', 'GET'])
def hello():
    return "Hello world"

# Isma Part - POST measures in db- GET Type de plante 
@app.route('/api/values',methods = ['POST', 'GET'])
def values():
    if request.method == 'POST':
        value = request.json # On récupère ID + mesures
        num = request.json["num"] # On récupére juste le champ num (= ID) 
        print(num)
        rmv = value.pop("num",None) # On récupére juste les mesures qui seront a ajouté dans la bd
        #On cherche dans la bd si on trouve le numéro 
        Measures = tinydb.Query()
        result = db.search(Measures.num == str(num))
        # Si on ne trouve pas le numéro, on renvoie -1
        if (len(result) < 1 ) :
          return "-1"


        #Si on trouve le numéro : enregitrer dans la bd & envoyer une alerte si besoin
        else : 

          # Enregistrer dans la bd 

          result[0]["measures"].append(value)
          print(len(result[0]["measures"]))
          if ( len(result[0]["measures"]) >= 10 ) :
            result[0]["measures"].pop(0)
          res = db.get(Measures.num == str(num)).doc_id #On récupére l'ID du document ou on update les valeurs
          db.update(result[0], doc_ids=[res])

          #Envoyer une alerte si besoin 

          # Pour envoyer l'email qu'une seule fois
          if ( len(result[0]["measures"]) <= 1 ) :
            prev = int("50")
            prev_bat = prev
          else :
            prev = result[0]["measures"]
            prev_bat = int(prev[len(prev)-2]["batterie"])
            prev = int(prev[len(prev)-2]["eau"])
            

          # Si jamais la valeur actuelle est vide et ce n'etait pas vide avant : on envoie un mail 
          # Si jamais la valeur actuelle est vide et la valeur précédente était déjà vide : c'est qu'on a déjà envoyé le mail 
          # et que l'utilisateur n'a pas encore rempli le bac, pas besoin de lui renvoyer
          if int(value["batterie"]) <= int("20") and  prev_bat > int("20") :
            #Envoyer l'email 
            with app.app_context():
              msg = Message(subject="VOTRE SYSTEME N'A PLUS DE BATTERIE",
                          sender=app.config.get("MAIL_USERNAME"),
                          recipients=[result[0]["email"]], # replace with your email for testing
                          body="L'équipe de iGarden vous informe que la batterie de votre système est presque vide. Il faudrait penser à la charger. ;)")
              mail.send(msg) 

          if int(value["eau"]) <= int("15") and  prev > int("15") :
            #Envoyer l'email 
            with app.app_context():
              msg = Message(subject="VOTRE SYSTEME N'A PLUS D'EAU",
                          sender=app.config.get("MAIL_USERNAME"),
                          recipients=[result[0]["email"]], # replace with your email for testing
                          body="L'équipe de iGarden vous informe que le bac à eau de votre système est presque vide. Il faudrait penser à le remplir. ;)")
              mail.send(msg) 

          return jsonify({'status': 'post ok'})

    #GET - Isma envoie son ID, on cherche si il existe. 
    #Si il existe, on renvoie le type de la plante
    #Si il existe pas on renvoie -1
    else:
        args = request.args
        num = args['num']

        Plant = tinydb.Query()
        result = db.search(Plant.num == num)

        # Si on ne trouve pas le numéro, on renvoie -1
        if (len(result) < 1) :
            return "-1"

        #Si on trouve le numéro : on renvoie le type de la plante
        else:
            type_plante = result[0]["plant_type"]
            if ( type_plante == "Plante grasse / cactus"):
                return "0"
            elif ( type_plante == "Plante normale" ):
                return "1"
            elif ( type_plante == "Plante tropicale" ):
                return "2"

# Alex Part -  POST device informations in db - GET all measures from all ID plant - DELETE the specific plant with "num" id
@app.route('/api/device',methods = ['POST', 'GET','DELETE'])
@cross_origin(origin='*')
def device():
    #POST - Post les infos de l'utilisateur = ajout d'un document dans la db
    if request.method == 'POST':
        db.insert(request.json[0])
        return jsonify({'status': 'post ok'})

    #GET - Envoyer toute la bd
    elif request.method == 'GET':
        with open('db_storage.json') as json_file:
            content = json.load(json_file)
        #print(content)
        return jsonify({
              'status': 'ok', 
              'val': content
            })

    #DELETE - suprimer le document correspondant à l'ID envoyé
    elif request.method == 'DELETE':
        Measures = tinydb.Query()
        db.remove(Measures.num == request.json[0]["id"])
        return jsonify({'status': 'delete ok'})


if __name__ == "__main__":
    app.run(debug=True,port=5002)
