/********************************************************** 
 *              Chargement des modules 
 **********************************************************/

// FileSystem : lecture de fichiers
const fs = require('fs');
const readline = require('readline');

// Express : serveur web 
const express = require('express');


/*****************************************************
 *             Lancement du serveur web
 *****************************************************/
const app = express();
app.use(express.json());

app.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
// par défaut, envoie le fichier index.html 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/velocite.html');
});


/********************************************************
 *          Définition de routes spécifiques 
 ********************************************************/

// renvoie la liste des stations
app.get('/stations', function(req, res) {
    console.log("Reçu : GET /stations");
    res.setHeader('Content-type', 'application/json');
    res.json(stations_list);
});

// renvoie la liste des vélos présents dans la station identifiée par :id
app.get('/stations/:id', function(req, res) {
    console.log("Reçu : GET /stations/" + req.params.id);
    res.setHeader('Content-type', 'application/json');
    res.json(velos_list[req.params.id]);
});

// ajoute un nouveau vélo dans la station identifiée par :id 
// (les paramètres du vélos sont passés dans le corps de la requête HTTP)              /!\ la .put n'est pas natif, il faut donc le config comme une requete html
app.put('/stations/:id', function(req, res) {
    console.log("Reçu : PUT /stations/" + req.params.id);
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');
    res.json(req.body);
    add_velo_to_list(req.params.id, req.body.cadre, req.body.options);
});

// supprime un vélo existant de la station identifiée par :id
// (l'identifiant du vélo sera passé dans le corps de la requête HTTP)
app.delete('/stations/:id', function(req, res) {
    console.log("Reçu : DELETE /stations/" + req.params.id);  //qu'est ce que je reçois comme info pour savoir quel vélo je dois supp ?? comment faire pour appeler app.delete coté client ? car pour app.get on fait fetch(./station)
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');
    res.json(req.body);
    del_velo_to_list(req.params.id, req.body);

});


/******************************************************************************
 *                      Gestion des stations et des vélos
 ******************************************************************************/
let stations_list = [];
let velos_list = [];
for(let i = 0; i < 29; i++) velos_list.push([]);

function add_velo_to_list(station, cadre, options){
  let v = {cadre: cadre, options: options};
  velos_list[station].push(v);
}

function del_velo_to_list(station, index){
  velos_list[station].splice(index, 1);
}



// lecture et initialisation de l'ensemble des stations
// source : https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
(async function processLineByLine(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  let i = 0;
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    let tab_split_str = line.split(', ');
    stations_list.push({id: i, nom: tab_split_str[0], latitude: Number(tab_split_str[1]), longitude: Number(tab_split_str[2]), espace: Number(tab_split_str[3])});
    i++;
  }
})('./stations.csv');

