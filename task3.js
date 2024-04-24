const crypto = require('crypto');

class Game {
    constructor(moves) {
        this.moves = moves;
        this.key = this.generateKey();
        this.computerMove = this.moves[Math.floor(Math.random() * this.moves.length)];
    }

    generateKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    hmac(message) {
        const hmac = crypto.createHmac('sha256', this.key);
        hmac.update(message);
        return hmac.digest('hex');
    }

    play() {
    console.log("HMAC:", this.hmac(this.computerMove));
    console.log("Available moves:");
    this.moves.forEach((move, index) => {
        console.log(`${index + 1} - ${move}`);
    });
    console.log("0 - exit");
    console.log("? - help");

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question("Enter your move: ", (userInput) => {
        readline.close();
        if (userInput === '0') {
            console.log("Exiting...");
            return;
        } else if (userInput === '?') {
            this.printHelp(); // Выводим таблицу помощи
            return;
        }

            const userMoveIndex = parseInt(userInput) - 1;
            if (isNaN(userMoveIndex) || userMoveIndex < 0 || userMoveIndex >= this.moves.length) {
                console.log("Invalid move. Please try again.");
                this.play();
                return;
            }

            const userMove = this.moves[userMoveIndex];
            console.log(`Your move: ${userMove}`);
            console.log(`Computer move: ${this.computerMove}`);
            const result = this.getResult(userMove, this.computerMove);
            console.log(result);
            console.log("HMAC key:", this.key);
        });
    }

    getResult(userMove, computerMove) {
        const n = this.moves.length;
        const index = this.moves.indexOf(userMove);
        const half = Math.floor(n / 2);
        const winningMoves = [
            ...this.moves.slice(index + 1, index + 1 + half),
            ...this.moves.slice(index - half, index)
        ];
        if (computerMove === userMove) {
            return "It's a draw!";
        } else if (winningMoves.includes(computerMove)) {
            return "You win!";
        } else {
            return "Computer wins!";
        }
    }

    printHelp() {
        console.log("Help:");
        const moves = ["Rock", "Paper", "3rd move", "4th", "5th"];
        const table = [
            ["", ...moves],
            ["Rock", "Draw", "Win", "Win", "Lose", "Lose"],
            ["Paper", "Lose", "Draw", "Win", "Win", "Lose"],
            ["3rd move", "Lose", "Lose", "Draw", "Win", "Win"],
            ["4th", "Win", "Lose", "Lose", "Draw", "Win"],
            ["5th", "Win", "Win", "Lose", "Lose", "Draw"]
        ];
    
        // Отрисовываем таблицу
        table.forEach(row => {
            console.log(row.map((cell, index) => index === 0 ? ` v PC\\User > | ${cell} |` : ` ${cell} |`).join(""));
            if (row === table[0]) {
                console.log(`+${"-".repeat(13 * moves.length)}+`);
            } else {
                console.log(`+${"-".repeat(13 * moves.length)}+`);
            }
        });
    }
}

const args = process.argv.slice(2);
if (args.length !== 3 && args.length !== 7) {
    console.log("Incorrect number of arguments. Please provide either 3 or 7 unique moves.");
    console.log("Example: node game.js rock paper scissors");
} else if (args.length !== new Set(args).size) {
    console.log("Repeated moves are not allowed.");
} else if (args.length % 2 === 0) {
    console.log("Even number of moves is not allowed.");
} else {
    const game = new Game(args);
    game.play();
}