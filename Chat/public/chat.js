"use strict";



document.addEventListener("DOMContentLoaded", function(e) {

    // socket ouverte vers le client
    var sock = io.connect();

    // Au démarrage : force l'affichage de l'écran de connexion
    document.getElementById("radio1").checked = true;
    document.getElementById("pseudo").focus();

    //récupération des éléments du DOM
    var aside = document.querySelector("aside");
    var main = document.querySelector("main");
    var clients = undefined;
    var pseudo = undefined;

    /** Réception de la liste des utilisateurs déjà connectés lors de l'arrivé d'un nouvel utilisateur
     *      affichage des utilisateurs
     */
    sock.on("bienvenue", function(tabClients) {
        document.getElementById("radio2").checked = true;
        aside.innerHTML = "";
        tabClients.forEach(val => {
            aside.innerHTML += val+"<br>";
        });
        clients = tabClients;
    });

    /** Récupetion d'un message
     * 
     */
    sock.on("message", function(msg) {
        console.log(msg.from);
        console.log(msg.to);
        if (msg.to != null && msg.from != null) {
            //if (clients[msg.to] !== undefined) {
                console.log(" --> message privé");
                //clients[msg.to].emit("message", { from: currentID, to: msg.to, text: msg.text, date: Date.now() });
                main.innerHTML += "<p class=\"mp\">"+msg.date+" - "+msg.from+" [privé @"+msg.to+"] : "+msg.text+"</p><br>";
            //}
        }
        if(msg.to == null && msg.from == null) {
            main.innerHTML += "<p class=\"system\">"+msg.date+" - "+msg.text+"</p><br>";
        }
        // sinon, envoi à tous les gens connectés
        if(msg.to == null && msg.from != null) {
            console.log("from = "+msg.from);
            console.log("pseudo = "+pseudo);

            if(msg.from == pseudo) {
                console.log(" --> moi-même");
                main.innerHTML += "<p class = \"moi\">"+msg.date+" - "+msg.from+" : "+msg.text+"</p><br>";
            }else {
                console.log(" --> broadcast");
                main.innerHTML += "<p>"+msg.date+" - "+msg.from+" : "+msg.text+"</p><br>";
            }
        }
    });

    /** Réception de la liste des utilisateurs connectés
     *      mise à jour de l'affichage des utilisateurs connectés
     */
    sock.on("liste", function(tabClients) { 
        aside.innerHTML = "";
        tabClients.forEach(val => {
            aside.innerHTML += val+"<br>";
        });
        clients = tabClients;
    });


    /**
     * Gestion de l'envoi d'un message dans le chat
     */
    document.addEventListener("keydown", function(e) {
        if(e.key == "Enter") {
            envoyer_msg();
        }
    });

    document.getElementById("btnEnvoyer").addEventListener("click", function() {
        envoyer_msg();
    });

    function envoyer_msg () {
        let btnEnovyer = document.getElementById("monMessage");
        let contenuTexte = btnEnovyer.value;


        //mp ?
        if(contenuTexte.match("^@")) {
            //for(let i = 0; i < clients.length; i++) {
            //if(contenuTexte.match("@"+clients[i])) {
                let tab = contenuTexte.split(' ');
                tab[0] = tab[0].replace("@", "").trim();
                contenuTexte = contenuTexte.replace("@"+tab[0], "");
                sock.emit("message", {to: tab[0], text: String(contenuTexte).trim()});
                console.log("mp");
                    //break;
                //} //mettre un else si l'utilisateur @ n'existe pas
            //}
        }

        //chifoumi ?
        if(contenuTexte.match("^/chifoumi @")){
            let tab = contenuTexte.split(' ');
            //vérif de l'action (pierre feuille....)
            if(tab.length == 3) {
                tab[1] = tab[1].replace("@", "").trim();
                sock.emit("chifoumi", {to: tab[1], action: tab[2].trim()});
            }else{
                main.innerHTML += "<p class=\"system\">CHIFOUMI - action interdite</p><br>";
            }
        }else{
            sock.emit("message", {to: null, text: String(contenuTexte).trim()});
            console.log("broadcast");
        }
        

        
        btnEnovyer.value = "";
    }

    sock.on("chifoumi", function(msg) {
        main.innerHTML += "<p class = \"chifoumi\">"+msg.date+" - "+msg.text+"</p><br>";
    });
    

    sock.on("erreur-connexion", function(msg) {
        let logscreen = document.getElementById("logScreen");
        let pError = document.createElement("p");
        pError.style.position = "absolute";
        pError.style.top = "40%"
        pError.style.left = "45%"
        pError.style.color = "red";
        let msgErreur = document.createTextNode(msg);
        pError.appendChild(msgErreur);
        logscreen.appendChild(pError);

    });

/** Connexion de utilisateur
 *      récupération du pseudo saisi
 *      transmission du pseudo au serveur
 */
    document.getElementById("btnConnecter").addEventListener("click", function(e) {
        main.innerHTML = "";
        pseudo = document.getElementById("pseudo").value;
        console.log("pseudo à la co = "+pseudo);
        sock.emit("login", pseudo); 
    });


/** Déconnexion de l'utilisateur
 *      transmission au serveur
 */
    document.getElementById("btnQuitter").addEventListener("click", function() {
        document.getElementById("radio2").checked = false;
        document.getElementById("radio1").checked = true;
        sock.emit('logout');
    });


    
    

    /* petites fonctions */

    function convert_heure(date) {
        date = date / 1000;
        date = date % (3600 * 24);
        date = date / 60;
        console.log(date);
    }

    function rep () {
        console.log("OK CHIFOUMI");
    }


    
});
    