


document.addEventListener("DOMContentLoaded", async function(e) {

    
    

/********************************************************** 
 *              Affichage de la map 
 **********************************************************/

    let mymap = L.map('map', { 
        center: [47.23867927062043, 6.0244235262439245],
        zoom: 15 
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mymap);
    
    let response = await fetch("/stations");

    if (response.status == 200) {
        var data = await response.json();
        for (let i=0; i < data.length; i++) {
            
                let numero = (i+1);
                let nom = data[i].nom;
                L.marker([data[i].longitude, data[i].latitude]).on('click', function(e) { display_popup(data[i])})
                    .addTo(mymap)
                    .bindPopup(numero + " - " + nom);
            //}
        }
    }
    
    let btnPlus = document.getElementById('btnPlus');
    btnPlus.addEventListener("click", function(e) {
        display_fomulaire();
    });
    add_velo();

/********************************************************** 
 *              Fenêtre popup
 **********************************************************/
async function display_popup(data) {
    let popup = document.getElementById('popup');
    popup.innerHTML = "";

    //ajout du bouton fermer
    let b = document.createElement("button");
    b.setAttribute("class", "btnClose");
    b.addEventListener("click", function(e) {
        popup.style.display = "none";
    })
    popup.appendChild(b);

    //ajout du nom de la station
    let title = document.createElement("h2");
    let txtTitle = document.createTextNode(data.nom);
    title.appendChild(txtTitle);
    popup.appendChild(title);

    //ajout du bloc aside
    let aside = document.createElement("aside");
    aside.style.textAlign = "right";
    let txtAside = document.createTextNode(data.espace < 2 ? data.espace+" borne" : data.espace+" bornes");
    aside.appendChild(txtAside);
    popup.appendChild(aside);

    //récup des infos des vélos
    let response_v = await fetch("/stations/"+data.id);
    if (response_v.status == 200) {
        let data_v = await response_v.json();
    
        //affichage des bornes
        for(let i = 0; i < data.espace; i++){
            let p = document.createElement("p");

            if(data_v[i] != undefined) {
                p.innerHTML = "Vélo cadre "+data_v[i].cadre+"<br><span>Options : "+data_v[i].options+"</span>";
                let btnDel = document.createElement("button");
                btnDel.setAttribute("class", "btnSupprimer");
                btnDel.setAttribute("title", "Supprimer le vélo");
                btnDel.style.display = "block";
                //btnDel.style.border = "3px";
                p.appendChild(btnDel);
                p.addEventListener('click', function(e){ 
                    del_velo(btnDel, i, data.id);
                });
                


            }
            popup.appendChild(p);
        }
    }

    popup.style.display = "block";
}

/********************************************************** 
 *              Fenêtre ajout vélo (formulaire)
 **********************************************************/
 function display_fomulaire() {
    let formulaire = document.getElementById('form');

    let btnClose = document.getElementsByClassName("btnClose");
    if(btnClose.length == 1) // dans ma fonction display_popup je ceéer un autre boutton avec la classe .btnClasse donc si display_popup est appelée avant cette fonction, la taille de ma collection btnClose change
        var index = 0;
    else
        index = 1;
    
    btnClose[index].addEventListener("click", function(e) {
        formulaire.style.display = "none";
    });

    //affichage de la liste déroulante
    let liste = document.getElementById('selStation');
    
    for (let i=0; i < data.length; i++) {
        let nom = data[i].nom;
        let opt = document.createElement('option');
        opt.value = nom;
        opt.text = nom;
        liste.appendChild(opt);
    }

    formulaire.style.display = "block";
}


//get formulaire
function get_formulaire() {        

        //récupération de l'élément checked dans les bontons radio
        let node_cadre = document.getElementsByName('radCadre');
        for(let i = 0; i < node_cadre.length; i++) {
            if(node_cadre[i].checked){
                var cadre = node_cadre[i].value;
            }
        }
        //récupération des éléments sélectionnés dans les checkbox
        let node_opt = document.querySelectorAll('input[type=checkbox]');
        let opts = "";
        for(let i = 0; i < node_opt.length; i++){
            if(node_opt[i].checked) {
                opts += i==node_opt.length-1 ? node_opt[i].value+"" && console.log(i): node_opt[i].value+", ";
                
            }
        }
        
        console.log("get ok");
        return {cadre: cadre, options: opts};
}

function add_velo() {
    document.getElementById('btnAjouter').addEventListener('click', function(e) {
        let velo = get_formulaire();
        //récupération du numéro de station
        let station = document.getElementById('selStation').selectedIndex;

        fetch('/stations/'+station, {method: 'PUT', headers: {'Content-type': 'application/json'}, body: JSON.stringify(velo)});
        
    });
}

function del_velo(b, i, station) {
    b.addEventListener('click', function(e) {
        
        fetch('/stations/'+station, {method: 'DELETE', headers: {'Content-type': 'application/json'}, body: JSON.stringify(i)});
    });
    
}

});