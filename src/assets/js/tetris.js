const plan = document.getElementById('tetris');
const baglam = plan.getContext('2d');
baglam.scale(40, 40); // şekillerin boy ve eni

function bolgeTemizleme() { // tamamlanan sıranın kaybolması
    let siraHesaplama = 1;
    dis: for (let y = bolge.length - 1; y | 0; --y) {
        for (let x = 0; x < bolge[y].length; ++x) {
            if (bolge[y][x] === 0) {
                continue dis;
            }
        }
        const sira = bolge.splice(y, 1)[0].fill(0);
        bolge.unshift(sira);
        ++y;
        oyuncu.puan += siraHesaplama * 1;
        siraHesaplama *= 2;
    }
}

function carpisma(bolge, oyuncu) { //şekillerin birleşmesi
    const a = oyuncu.matrix;
    const b = oyuncu.pos;
    for (let y = 0; y < a.length; ++y) {
        for (let x = 0; x < a[y].length; ++x) {
            if (a[y][x] !== 0 &&
                (bolge[y + b.y] &&
                    bolge[y + b.y][x + b.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function matrixYaratma(w, h) { // tetris şekillerinin yapılması
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function sekilYaratma(type) { // t şekli
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') { // o şekli
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') { // L şekli
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') { //j şekli
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') { // I şekli
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') { // S şekli
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') { // Z şekli
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }

}

function cizim() {
    baglam.fillStyle = '#00FF00'; //zemin rengi
    baglam.fillRect(0, 0, plan.width, plan.height);
    matrixCizimi(bolge, { x: 0, y: 0 });
    matrixCizimi(oyuncu.matrix, oyuncu.pos);
}

function matrixCizimi(matrix, offset) { // şekillerin çizilmesi
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                baglam.fillStyle = renkler[value];
                baglam.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
            }
        });
    });
}

function yapisma(bolge, player) { // şekillerin birbirine yapışması
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0)
                bolge[y + player.pos.y][x + player.pos.x] = value;
        })
    })
}

function oyuncuInisi() { // şeklin inişi
    oyuncu.pos.y++;
    if (carpisma(bolge, oyuncu)) {
        oyuncu.pos.y--;
        yapisma(bolge, oyuncu);
        oyuncuReset();
        bolgeTemizleme();
        puanGüncelleme();
    }
    inmeHesap = 0;
}

function oyuncuHareket(dir) {
    oyuncu.pos.x += dir;
    if (carpisma(bolge, oyuncu)) {
        oyuncu.pos.x -= dir;
    }
}

function oyuncuReset() {
    const sekiller = 'ILJOTSZ';
    oyuncu.matrix = sekilYaratma(sekiller[sekiller.length * Math.random() | 0]);
    oyuncu.pos.y = 0;
    oyuncu.pos.x = (bolge[0].length / 2 | 0) -
        (oyuncu.matrix[0].length / 2 | 0);
    if (carpisma(bolge, oyuncu)) {
        bolge.forEach(row => row.fill(0));
        oyuncu.puan = 0;
        puanGüncelleme();
    }
}

function oyuncuDöngüsü(dir) {
    const pos = oyuncu.pos.x;
    let denge = 1;
    döngü(oyuncu.matrix, dir);
    while (carpisma(bolge, oyuncu)) {
        oyuncu.pos.x += denge;
        denge = -(denge + (denge > 0 ? 1 : -1));
        if (denge > oyuncu.matrix[0].length) {
            döngü(oyuncu.matrix, -dir);
            oyuncu.pos.x = pos;
            return;
        }
    }
}

function döngü(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let inmeHesap = 0;
let düsmeAralıgı = 300; // oyun hızı
let sonZaman = 0;

function güncelleme(zaman = 0) {
    const deltaZamanı = zaman - sonZaman;
    sonZaman = zaman;
    inmeHesap += deltaZamanı;
    if (inmeHesap > düsmeAralıgı) {
        oyuncuInisi();
    }
    cizim();
    requestAnimationFrame(güncelleme);
}

function puanGüncelleme() { // puanlama
    document.getElementById('puan').innerText = oyuncu.puan;
}

const renkler = [
    null,
    '#FFFF00',
    '#FF0000',
    '#008000',
    '#099FFF',
    '#FF00FF',
    '#9D00FF',
    '#FF6600',
];
const bolge = matrixYaratma(12, 20);
const oyuncu = {
    pos: { x: 0, y: 0 },
    matrix: null,
    puan: 0,
}

document.addEventListener('keydown', event => { // oyun tuşları
    if (event.keyCode === 37) {
        oyuncuHareket(-1);
    } else if (event.keyCode === 39) {
        oyuncuHareket(1);
    } else if (event.keyCode === 40) {
        oyuncuInisi();
    } else if (event.keyCode === 32) {
        oyuncuDöngüsü(-1);
    }
});

oyuncuReset();
güncelleme();
puanGüncelleme();