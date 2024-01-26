# HomeWave

HomeWave est une application réalisée en React Native qui permet de détecter les intrusions à l'aide de capteurs de mouvement et d'un laser qui communiquent en MQTT par le biais d'un backend.
## Installation

Pour installer HomeWave, vous devez avoir Node.js, npm et Expo CLI installés sur votre machine. Vous devez également avoir un smartphone ou un émulateur compatible avec Expo.

Ensuite, vous pouvez cloner ce dépôt et installer les dépendances :

```bash
git clone https://github.com/elimf/HomeWave.git
cd HomeWave
npm install
```

Pour lancer l'application, vous pouvez utiliser la commande suivante :

```bash
expo start
```

Vous verrez alors un QR code que vous pouvez scanner avec votre smartphone ou votre émulateur pour ouvrir l'application.



Vous devez également disposer d'un capteur de mouvement et d'un laser connectés et du backend qui envoie les données au broker MQTT. 

## Fonctionnement

HomeWave utilise le protocole MQTT pour recevoir les données du capteur de mouvement et du laser. Le protocole MQTT est un protocole de messagerie léger basé sur le principe de publication/abonnement. Il permet d'établir une communication bidirectionnelle entre des appareils connectés.

HomeWave s'abonne au topic `object` et reçoit les messages envoyés par le microcontrôleur. Les messages sont de type text et contiennent des messages concernant l'état des capteurs.


HomeWave analyse les messages et détermine s'il y a une intrusion ou non. Si le capteur de mouvement détecte un mouvement et que le laser est coupé, HomeWave affiche une alerte sur l'écran et émet un son. Sinon, HomeWave affiche un message indiquant que tout est normal.

## Dépendances

HomeWave utilise les librairies React Native suivantes :

- [react-native-mqtt] : pour la communication MQTT
