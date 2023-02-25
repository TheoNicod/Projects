"use strict";

class Snake {

    constructor(w) {
        this.size = 20;
        this.speed = 0.17;
        this.vecX = 0;
        this.vecY = 1;
        this.taille_max = 100;
        this.points = [{x: w/2, y: 100}, {x: w/2, y: 0}]; //contient le point de la tête et le point de la queue
        this.lost = false;
        
    }


    /* Ajoute un point de l'ecran dans le tableau points[]  */
    addPoint(a, b) {
        let o = {x: a, y: b};
        this.points.splice(1, 0, o);
    }

    /* Supprime le dernier point du tableau points */
    del_last_point() {
        this.points.pop();
    }

    /* retourne le dernier element du tableau point */
    access_last_index() {
        return this.points[this.points.length-1];
    }

    /* Calcule la taille réelle du serpent  */
    sum_snakes_segments() { 
        let somme = 0;
        let s = this.points.length;
        for(let i = 0; i < s-1; i++) {
            somme += this.dist_points(this.points[i+1].x, this.points[i].x, this.points[i+1].y, this.points[i].y);
        }
        return somme;
    }

    /* retourne la taille du dernier segment du serpent */
    size_last_seg() {
        let s = this.points.length;
        return this.dist_points(this.points[s-1].x, this.points[s-2].x, this.points[s-1].y, this.points[s-2].y);
    }

    /** Calcule la différence de taille entre la taille max autorisée et la taille réelle du serpent */
    size_diff() {
        let p = this.sum_snakes_segments();
        return p - this.taille_max;
    }

/* Mets à jour le point qui représente la queue du serpent en fonction de la taille réelle du celui-ci */
    actualise_la_queue() {
        let s = this.points.length;
        let diff = this.size_diff();
        let size_seg_last = this.size_last_seg();

        if(size_seg_last < 13) {
            this.del_last_point();
        } 
        if(diff > 0) {
            //on cherche la direction de la queue du serpent et on actualise le dernier point du segment qui représente la queue
            if(this.points[s-2].x < this.access_last_index().x) { // direction vers la gauche
                this.points[s-1].x -= diff;
            }
            if(this.points[s-2].x > this.access_last_index().x) { // direction vers la droite
                this.points[s-1].x += diff;
            }
            if(this.points[s-2].y < this.access_last_index().y) { // direction vers le haut
                this.points[s-1].y -= diff;
            }
            if(this.points[s-2].y > this.access_last_index().y) { // direction vers le bas
                this.points[s-1].y += diff;
            }
        }
    }


    /* retourne le distance entre les points {x1, y1} et {x2, y2} */
    dist_points (x1, x2, y1, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}

document.addEventListener("DOMContentLoaded", function() {

    /** Récupération des informations liées au canvas */
    let canvas = document.getElementById("cvs");
    const WIDTH = canvas.width = window.innerWidth;
    const HEIGHT = canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d"); 
    
    let snake = new Snake(WIDTH);

    //init de variables
    let key = undefined;
    let yet = false;
    let tab;

    //initialisation du bonus
    let a =  Math.floor(Math.random() * WIDTH +1);
    let b =  Math.floor(Math.random() * HEIGHT +1);
    var bonus = {x: a, y: b, size: 20};

    document.addEventListener("keydown", function(e) {
        switch (e.key) {
            case "ArrowRight":
                if(snake.vecX != -1) {
                    snake.vecX = 1;
                    snake.vecY = 0;
                    snake.addPoint(snake.points[0].x, snake.points[0].y);
                } 
                break;
            case "ArrowLeft": 
            if(snake.vecX != 1) {
                snake.vecX = -1;
                snake.vecY = 0;
                snake.addPoint(snake.points[0].x, snake.points[0].y);
            }
                break;
            case "ArrowUp": 
            if(snake.vecY != 1) {
                snake.vecX = 0;
                snake.vecY = -1;
                snake.addPoint(snake.points[0].x, snake.points[0].y);
            }
                break;
            case "ArrowDown": 
            if(snake.vecY != -1) {
                snake.vecX = 0;
                snake.vecY = 1;
                snake.addPoint(snake.points[0].x, snake.points[0].y);
            }
                break;
        }
    });

    /** Dernière mise à jour de l'affichage */
    let last = Date.now();

    /** Dernière mise à jour */
    function update(now) {
        // delta de temps entre deux mises à jour 
        let dt = now - last;
        last = now;

        snake.points[0].x += snake.vecX * dt * snake.speed;
        snake.points[0].y += snake.vecY * dt * snake.speed;
    }

    

    //initialistation des paramètre du traçage du serpent
    ctx.strokeStyle = "red";
    ctx.lineWidth = snake.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    /* Trace les segments du serpent */
    function draw_snake() {
        let s = snake.points.length;
        ctx.beginPath();
        ctx.moveTo(snake.points[s-1].x, snake.points[s-1].y); //on se place sur le dernier point du serpent
        
        for(let i = 0; i < s-1; i++) {
            ctx.lineTo(snake.points[s-2-i].x, snake.points[s-2-i].y);
        }
        ctx.stroke();
        snake.actualise_la_queue();
    }

    /* Vérifie que la tête du serpent ne dépasse pas les bords de la fenêtre */
    function collision_window() {
        if(snake.points[0].x <= 0 || snake.points[0].y <= 0 || snake.points[0].x >= WIDTH || snake.points[0].y >= HEIGHT) {
            snake.lost = true;
        }
    }

    /* Vérifie si la partie est perdue, si oui cela affiche le tableau des scores */
    function check_is_lost() {
        if(snake.lost && !yet) {
            key = prompt('Perdu entrez votre pseudo :');
            save_to_storage();
            sort_scores();
            yet = true;
        }
        if(yet == true && key) {
            display_scoreboard();
        }
    }

    /* Enregistre le score avec le pseudo saisie dans le localStorage */
    function save_to_storage() {
        //recherche du pseudo dans le storage
        let i = localStorage.getItem(key);
        let tab = [];
        if(i) {
            tab = JSON.parse(i);
        }
        tab.push(score);
        let string = JSON.stringify(tab);
        localStorage.setItem(key, string);
    }

    /* Trie le tableau associé au pseudo saisi, dans l'ordre desc */
    function sort_scores () {
        let string = localStorage.getItem(key);
        tab = JSON.parse(string);
        const sort_cmp = (a, b) => b - a;
        tab.sort(sort_cmp);
    }

    let txt = "";
    /* Affiche le tableau des scores (les 10 premiers) */
    function display_scoreboard() {
        let s = tab.length;
        ctx.fillStyle = "purple";
        ctx.font = "30px Dyuthi";
        ctx.textAlign = "center";
        if(s >= 10)
            s = 10;

       let first_str = JSON.stringify(tab[0]);
       
        ctx.fillText("GAME OVER", WIDTH/2, HEIGHT/2 - 300);
        for(let i = 0; i < s; i++) {
            let add = "";
            let str = JSON.stringify(tab[i]);
            let dif = first_str.length - str.length;
            for(let i = 0; i < dif; i++) { //2eme boucle pour afficher des ' . ' pour que les lignes aient la même taille
                add += ". ";
            }
            txt = key+" . . . . . . . . . . "+add+tab[i];
            ctx.fillText(txt, WIDTH/2, (HEIGHT/2-200)+i*35);
        }
        
        
    }
   
    //affichage du score en haut à droite de la fenêtre
    var score = 0;
    function draw_score() {
        ctx.fillStyle = "white";
        ctx.font = "20px Purisa";
        ctx.fillText("Score : "+score, WIDTH-150, 30);
        
    }

    /* Affichage du bonus */    
    function draw_bonus() {
        ctx.fillRect(bonus.x, bonus.y, bonus.size, bonus.size);
        /*
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(bonus.x, bonus.y, 10, 0, 2*Math.PI);
        ctx.fill();
        */
    }

    /* Vérifie si la tête du serpent entre en collision avec le bonus, si oui alors un nouveau bonus esst affiché aléatoirement */
    function collision_bonus() {
        if( (snake.points[0].x <= bonus.x + bonus.size + 5 && snake.points[0].x - 5 >= bonus.x) && (snake.points[0].y <= bonus.y + bonus.size + 5 && snake.points[0].y >= bonus.y - 5) ) {
            score += 10;
            snake.taille_max += 10;
            if(score%50 == 0) { //augmente la vitesse tout les 50 points
                snake.speed += 0.02;
            }
            let a =  Math.floor(Math.random() * WIDTH +1);
            let b =  Math.floor(Math.random() * HEIGHT +1);
            bonus.x = a;
            bonus.y = b;
        }
        draw_bonus();
    }

    /** Réaffichage du contenu du canvas */
    function render() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#E0E0E0";
        draw_snake();
        collision_window();
        draw_score();
        collision_bonus();
        check_is_lost();
        
    }

    /** Boucle de jeu */
    (function loop() {
        // précalcul de la prochaine image
        requestAnimationFrame(loop);
        // mise à jour du modèle de données
        update(Date.now());
        // affichage de la nouvelle image 
        render();
    })();
});

