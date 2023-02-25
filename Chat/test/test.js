


class Test {
    

    constructor(code) {
        this.joueurs = [];
        this.code = code;
        this.jeu = new Jeu_de_cartes();
        this.jeu.creer_jeu();
        
    }

    ajout_joueur(j) {
        let t = {etat: 0, jeu: []}; // 0 == pas prêt & 1 == prêt
        this.joueurs[j] = t; 
        this.nb_joueurs++;
    }
}

class Jeu_de_cartes {

    constructor() {
        this.jeu = [];
    }

    creer_jeu() {
        let nb = -3;
        for(let i = 0; i < 150; i++) {
            if(i%10 == 0) nb++;
            if(i < 5) this.jeu.push(-2);
            if(i >= 5 && i < 20) this.jeu.push(0);
            if(i >= 20 && i < 30) this.jeu.push(-1);
            if(i >= 30) this.jeu.push(nb);
        }
        this.randomize();
        this.test();
    }

    randomize() {
        let i, j, tmp;
        for (i = this.jeu.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = this.jeu[i];
            this.jeu[i] = this.jeu[j];
            this.jeu[j] = tmp;
        }
    }
/*
    test() {
        let m_deux = 0;
        let m_un = 0;
        let tab = [];
        for(let v in this.jeu) {
            if(v == -2) m_deux++;
            if(v == -1) m_un++;
            if(v == 0) tab[0] = tab[0] + 1;
            if(v == 1) tab[1] = tab[1] + 1;
            if(v == 2) tab[2] = tab[2] + 1;
            if(v == 3) tab[3] = tab[3] + 1;
            if(v == 4) tab[4] = tab[4] + 1;
            if(v == 5) tab[5] = tab[5] + 1;
            if(v == 6) tab[6] = tab[6] + 1;
            if(v == 7) tab[7] = tab[7] + 1;
            if(v == 8) tab[8] = tab[8] + 1;
            if(v == 9) tab[9] = tab[9] + 1;
            if(v == 10) tab[10] = tab[10] + 1;
            if(v == 11) tab[11] = tab[11] + 1;
            if(v == 12) tab[12] = tab[12] + 1;
            console.log(m_deux);
            console.log(m_un);
            for(let i = 0; i<13; i++) {
                console.log(tab[i]);
            }

        }
    }
    */ 
}


var counter = 10;
var intervalId = null;
function finish() {
  clearInterval(intervalId);
  //document.getElementById("bip").innerHTML = "TERMINE!";
  console.log("FINISH");
}
function bip() {
    counter--;
    if(counter == 0) finish();
    else {	
        //document.getElementById("bip").innerHTML = counter + " secondes restantes";
        console.log(counter);
    }	
}
function start(){
  intervalId = setInterval(bip, 1000);
}	

var j = [];
j["theo"] = {score: 4};
j["romain"] = {score: 34};
j["august"] = {score: 198};
j["biktoooor"] = {score: 54};
j["mmickeallandreau"] = {score: 9};


//console.log(tri_score());

var tab = to_tab();
console.log(tab);
//tri_score();
console.log(tab);


function tri_score() {
   
    for(let i = 0; i < 5-1; i++) {
        for(let j = i+1; j < 5; j++) {
            if(tab[j][1] > tab[i][1]) {
                let tmp = tab[i];
                tab[i] = tab[j];
                tab[j] = tmp;
            }
        }

    }
};


function to_tab() {
    
    let tab = [];
    let cpt = 0;
        for(val in j) {
            //tab.push([]);
            tab.push([val, j[val].score])
            cpt++;
        }
    return tab;
};










