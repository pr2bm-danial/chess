const blackRook1 = document.getElementById('a8');
const blackKnight1 = document.getElementById('b8');
const blackBisho1 = document.getElementById('c8');
const blackQueen = document.getElementById('d8');
const blackKing = document.getElementById('e8');
const blackBisho2 = document.getElementById('f8');
const blackKnight2 = document.getElementById('g8');
const blackRook2 = document.getElementById('h8');

const blackPawn1 = document.getElementById('a7');
const blackPawn2 = document.getElementById('b7');
const blackPawn3 = document.getElementById('c7');
const blackPawn4 = document.getElementById('d7');
const blackPawn5 = document.getElementById('e7');
const blackPawn6 = document.getElementById('f7');
const blackPawn7 = document.getElementById('g7');
const blackPawn8 = document.getElementById('h7');

const whitePawn1 = document.getElementById('a2');
const whitePawn2 = document.getElementById('b2');
const whitePawn3 = document.getElementById('c2');
const whitePawn4 = document.getElementById('d2');
const whitePawn5 = document.getElementById('e2');
const whitePawn6 = document.getElementById('f2');
const whitePawn7 = document.getElementById('g2');
const whitePawn8 = document.getElementById('h2');

const whiteRook1 = document.getElementById('a1');
const whiteKnight1 = document.getElementById('b1');
const whiteBishop1 = document.getElementById('c1');
const whiteQueen = document.getElementById('d1');
const whiteKing = document.getElementById('e1');
const whiteBishop2 = document.getElementById('f1');
const whiteKnight2 = document.getElementById('g1');
const whiteRook2 = document.getElementById('h1');

document.addEventListener('DOMContentLoaded', function () {
    // Array zum Speichern der Spielfeld-Elemente
    const cells = document.querySelectorAll('.cell');

    // Das aktuell gezogene Element
    let draggedElement = null;

    // Variable, um den Zug des Spielers zu verfolgen
    let isWhitesTurn;

    // Variable, um zu überprüfen, ob ein gültiger Schachzug gemacht wurde
    let moved = false;

    // Variable, um die vorherige Position zu speichern
    let previousPosition = null;

    // Funktion, um das Spiel zu starten und den Startspieler zu bestimmen
    checkWhoStart();

    // Funktion, um die Spielfeld-Elemente zu initialisieren
    initializeCells();

    // Funktion, um die Drag-and-Drop-Elemente zu initialisieren
    initializeDraggables();

    // Funktion, um die Spielfeld-Elemente zu initialisieren
    function initializeCells() {
        cells.forEach(cell => {
            // Eventlistener für Drag-over-Ereignisse
            cell.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            // Eventlistener für Drop-Ereignisse
            cell.addEventListener('drop', (event) => {
                event.preventDefault();

                // Überprüfe, ob ein Element gezogen wird und ob die Figur korrekt bewegt wird
                if (draggedElement) {
                    const isMovingCorrectFigure = isWhitesTurn
                        ? draggedElement.alt.includes('w_')
                        : draggedElement.alt.includes('b_');

                    // Wenn die richtige Figur bewegt wird, führe den Zug aus
                    if (isMovingCorrectFigure) {
                        moveFigure(cell);
                    } else {
                        console.log('Falsche Figur bewegt!');
                    }
                }
            });
        });
    }

    // Funktion, um eine Figur auf das Zielfeld zu bewegen
    function moveFigure(cell) {
        // Überprüfe, ob draggedElement vorhanden ist
        console.log('draggedElement:', draggedElement);
        console.log('draggedElement.parentElement:', draggedElement.parentElement);
        console.log('draggedElement.parentElement.id:', draggedElement.parentElement.id);
        if (draggedElement) {
            // Direkt die vorherige Position aus der ID extrahieren
            const previousPosition = getChessPosition(draggedElement.parentElement.id);
            console.log(`Vorherige Position: ${previousPosition}`);

            // Überprüfe, ob die Zelle bereits eine Figur enthält
            checkCell(cell);

            // Überprüfe den speziellen Fall für den ersten Zug eines Bauern
            if (isPawnFirstMove(draggedElement)) {
                // Überprüfe, ob der erste Zug gültig ist (maximal zwei Schritte vorwärts)
                const validFirstMove = isValidFirstPawnMove(cell, draggedElement);
                if (!validFirstMove) {
                    console.log('Ungültiger erster Zug für den Bauern!');
                    restorePreviousPosition();
                    return; // Beende die Funktion, wenn der Zug ungültig ist
                }
            }


            // Füge die gezogene Figur dem Zielfeld hinzu
            cell.appendChild(draggedElement);

            // Setze die neue Position
            const newPosition = getChessPosition(cell.id);
            // Überprüfe, ob die Figur auf ihre ursprüngliche Position zurückgestellt wurde
            const currentPosition = getChessPosition(draggedElement.parentElement.getAttribute('id'));
            console.log(`Aktuelle Position: ${currentPosition}`);

            // Überprüfe, ob die Figur bewegt wurde, indem die Positionen verglichen werden
            if (previousPosition !== newPosition) {
                console.log(`Figur wurde von ${previousPosition} nach ${newPosition} bewegt.`);
                // Gültige Bewegung, ändere den Zug zum anderen Spieler
                isWhitesTurn = !isWhitesTurn;
                moved = true;
            } else {
                console.log('Ungültiger Schachzug! Figur bleibt an der gleichen Position.');
                // Setze die vorherige Position wiederher
                restorePreviousPosition();
            }
        }
    }



    // Funktion, um die vorherige Position zu löschen
    function restorePreviousPosition() {
        if (previousPosition !== null) {
            const previousCell = document.getElementById(previousPosition);
            if (previousCell) {
                previousCell.appendChild(draggedElement);
            } else {
                console.log('Ungültige vorherige Position gefunden.');
            }
        }
    }


    // Funktion, um die Schachposition aus der Zellen-ID zu extrahieren
    function getChessPosition(cellId) {
        // Überprüfe, ob die Zellen-ID eine gültige Zeichenkette ist
        if (typeof cellId !== 'string' || cellId.length !== 2) {
            console.error('Ungültige Zellen-ID:', cellId);
            return null;
        }

        const column = cellId.charAt(0);
        const row = cellId.charAt(1);

        // Überprüfe, ob die Spalte ein gültiger Buchstabe ist und die Zeile eine gültige Zahl
        if (!(/[a-h]/i.test(column) && /[1-8]/.test(row))) {
            console.error('Ungültige Zellen-ID:', cellId);
            return null;
        }

        return column + row;
    }


    // Funktion, um die Zelle zu überprüfen und gegebenenfalls abzuräumen
    function checkCell(cell) {
        // Überprüfe, ob die Zelle bereits eine Figur enthält und ob ein Zug erfolgt ist
        if (cell.hasChildNodes() && moved) {
            clearCell(cell);
        }
    }

    // Funktion, um eine Zelle abzuräumen
    function clearCell(cell) {
        // Entferne alle Kinder der Zelle (Figur)
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    }

    // Funktion, um zu überprüfen, ob ein Bauer den ersten Zug macht
    function isPawnFirstMove(pawn) {
        // Hier musst du deine eigene Logik implementieren, um zu überprüfen, ob der Bauer den ersten Zug macht
        // Du könntest beispielsweise überprüfen, ob die Position des Bauern dem ersten Zug entspricht
        // (abhängig von der Implementierung der Positionierung deiner Figuren auf dem Schachbrett)
        // Beispiel: Wenn der Bauer auf Position 'a2' oder 'a7' steht, ist es der erste Zug für diesen Bauer
        return pawn.id === 'a2' || pawn.id === 'a7';
    }

    // Funktion, um zu überprüfen, ob der erste Zug eines Bauern gültig ist (maximal zwei Schritte vorwärts)
    function isValidFirstPawnMove(targetCell, pawn) {
        // Hier musst du deine eigene Logik implementieren, um zu überprüfen, ob der erste Zug gültig ist
        // Du könntest beispielsweise überprüfen, ob die Anzahl der Schritte vorwärts maximal zwei beträgt
        // Beispiel: Wenn die Zielzelle auf der gleichen Spalte wie die aktuelle Zelle liegt und der vertikale Abstand maximal zwei beträgt, ist der Zug gültig
        const currentColumn = pawn.id.charAt(0);
        const targetColumn = targetCell.id.charAt(0);
        const verticalDistance = Math.abs(Number(targetCell.id.charAt(1)) - Number(pawn.id.charAt(1)));

        return currentColumn === targetColumn && verticalDistance <= 2;
    }

    // Funktion, um die Drag-and-Drop-Elemente zu initialisieren
    function initializeDraggables() {
        const draggables = document.querySelectorAll('.cell img');

        draggables.forEach(draggable => {
            // Eventlistener für das Starten des Ziehvorgangs auf Desktop-Geräten
            draggable.addEventListener('dragstart', (event) => {
                draggedElement = event.target;
                event.dataTransfer.setData('text/plain', 'dummy');
                draggedElement.classList.add('dragging');
            });

            // Eventlistener für das Beenden des Ziehvorgangs auf Desktop-Geräten
            draggable.addEventListener('dragend', () => {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
            });
        });
    }

    // Funktion, um zufällig zu bestimmen, wer beginnt
    function whosTurn() {
        return Math.random() < 0.5 ? 'white' : 'black';
    }

    // Funktion, um zu überprüfen, wer beginnt und entsprechende Aktionen auszuführen
    function checkWhoStart() {
        let announce = document.getElementById('announce');
        isWhitesTurn = whosTurn() === 'white';
        console.log(isWhitesTurn ? 'White begins!' : 'Black begins!');
        if (isWhitesTurn) {
            announce.innerHTML = "White begins!";
        }
        else {
            announce.innerHTML = "Black begins!";
        }
    }

    
});    


