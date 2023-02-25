// Chargement des modules 
const express = require('express');
const app = express();
const http = require('http');
const { exit } = require('process');
const server = app.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

// Ecoute sur les websockets
const { Server } = require("socket.io");
const io = new Server(server);

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
// set up to 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/chat.html');
});

// déblocage requetes cross-origin
//io.set('origins', '*:*');

/***************************************************************
 *           Gestion des clients et des connexions
 ***************************************************************/

var clients = {};       // { id -> socket, ... }




/**
 *  Supprime les infos associées à l'utilisateur passé en paramètre.
 *  @param  string  id  l'identifiant de l'utilisateur à effacer
 */
function supprimer(id) {
    delete clients[id];
}


// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
    
    // message de debug
    console.log("Un client s'est connecté");
    var currentID = null;
    
    /**
     *  Doit être la première action après la connexion.
     *  @param  id  string  l'identifiant saisi par le client
     */
    socket.on("login", function(id) {
        // si le pseudo est déjà utilisé, on lui envoie l'erreur
        if (clients[id]) {
            socket.emit("erreur-connexion", "Le pseudo est déjà pris.");
            return;
        }
        // sinon on récupère son ID
        currentID = id;
        // initialisation
        clients[currentID] = socket;
        // log
        console.log("Nouvel utilisateur : " + currentID);
        // envoi d'un message de bienvenue à ce client
        socket.emit("bienvenue", Object.keys(clients)); //envoie le tableau de client au client dans la partie 'bienvenue'
        // envoi aux autres clients 
        let d = new Date();
        socket.broadcast.emit("message", { from: null, to: null, text: currentID + " a rejoint la discussion", date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() });
        // envoi de la nouvelle liste à tous les clients connectés 
        socket.broadcast.emit("liste", Object.keys(clients));
    });
    
    
    /**
     *  Réception d'un message et transmission à tous.
     *  @param  msg     Object  le message à transférer à tous  
     */
    socket.on("message", function(msg) {
        console.log("Reçu message");   
        // si message privé, envoi seulement au destinataire
        if (msg.to != null) {
            console.log("il y a un destinataire");
            if (clients[msg.to] !== undefined) {
                console.log("destinataire connu");
                console.log(" --> message privé");
                let d = new Date();
                clients[msg.to].emit("message", { from: currentID, to: msg.to, text: msg.text, date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() });
                if (currentID != msg.to) {
                    let d = new Date();
                    socket.emit("message", { from: currentID, to: msg.to, text: msg.text, date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() });
                }
            }
            else {
                let d = new Date();
                socket.emit("message", { from: null, to: currentID, text: "Utilisateur " + msg.to + " inconnu", date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() });
            }
        }
        // sinon, envoi à tous les gens connectés
        else {
            console.log(" --> broadcast");
            let d = new Date();
            io.sockets.emit("message", { from: currentID, to: null, text: msg.text, date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() });
        }
    });
    
        
    /** 
     *  Gestion des déconnexions
     */
    
    // fermeture
    socket.on("logout", function() { 
        // si client était identifié (devrait toujours être le cas)
        if (currentID) {
            console.log("Sortie de l'utilisateur " + currentID);
            // envoi de l'information de déconnexion
            let d = new Date();
            socket.broadcast.emit("message", 
                { from: null, to: null, text: currentID + " a quitté la discussion", date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() } );
            // suppression de l'entrée
            supprimer(currentID);
            // désinscription du client
            currentID = null;
             // envoi de la nouvelle liste pour mise à jour
            socket.broadcast.emit("liste", Object.keys(clients));
        }
    });
    
    // déconnexion de la socket
    socket.on("disconnect", function(reason) { 
        // si client était identifié
        if (currentID) {
            // envoi de l'information de déconnexion
            let d = new Date();
            socket.broadcast.emit("message", 
                { from: null, to: null, text: currentID + " vient de se déconnecter de l'application", date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() } );
            // suppression de l'entrée
            supprimer(currentID);
            // désinscription du client
            currentID = null;
            // envoi de la nouvelle liste pour mise à jour
            socket.broadcast.emit("liste", Object.keys(clients));
        }
        console.log("Client déconnecté");
    });

     // lancement d'un défi chifoumi
     socket.on("chifoumi", function(e) { 
        //vérif 
        
        if(clients[e.to] !== undefined) {
                       
            if(e.action == ":paper:" || e.action == ":rock:" || e.action == ":scissors:" || e.action == ":spock:" || e.action == ":lizard:") {
                let d = new Date();
                clients[e.to].emit("chifoumi", 
                { from: currentID, to: e.to, text: "[chifoumi] - "+currentID+ " te défie à Rock-Paper-Scissors-Lizard-Spock <input type=\"button\" value=\"lui répondre\">", date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() } );
                console.log("chifoumi envoyé à "+e.to+" de "+currentID);
            }
        }else{
            let d = new Date();
            socket.emit("message", 
            { from: null, to: null, text: "CHIFOUMI - Action innatendue", date: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() } );

        }

    

     });
        
});