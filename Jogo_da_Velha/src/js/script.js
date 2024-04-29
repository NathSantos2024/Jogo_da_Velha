// Aguarda o carregamento completo do DOM antes de executar o código JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Obtém o botão de início do jogo
    const startButton = document.getElementById('start-btn');
    // Adiciona um evento de clique ao botão de início do jogo
    startButton.addEventListener('click', () => {
        // Obtém os nomes dos jogadores inseridos nos campos de entrada
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;

        // Verifica se os nomes dos jogadores foram inseridos
        if (!player1Name || !player2Name) {
            // Se algum nome estiver faltando, exibe um alerta pedindo para inserir os nomes
            alert('Por favor, insira nomes para ambos os jogadores.');
            return;
        }

        // Esconde o formulário de entrada de nomes e exibe o tabuleiro do jogo
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('game-board').style.display = 'grid';
        document.getElementById('scores').style.display = 'block';
        // Inicia o jogo com os nomes dos jogadores fornecidos
        startGame(player1Name, player2Name);
    });
});

// Variáveis para o placar e nomes dos jogadores
let currentPlayer = 'X'; // O jogador atual, começa com 'X'
let playerXScore = 0; // Pontuação do jogador 'X'
let playerOScore = 0; // Pontuação do jogador 'O'
let player1Name = ''; // Nome do jogador 1
let player2Name = ''; // Nome do jogador 2
let cells = []; // Array para armazenar as células do tabuleiro

// Elementos do placar
const playerXScoreDisplay = document.getElementById('player-x-score');
const playerOScoreDisplay = document.getElementById('player-o-score');
const board = document.getElementById('game-board');

// Função para iniciar o jogo
const startGame = (player1, player2) => {
    // Define os nomes dos jogadores
    player1Name = player1;
    player2Name = player2;
    // Reinicia o tabuleiro do jogo
    resetBoard();
};

// Função para reiniciar o tabuleiro
const resetBoard = () => {
    // Limpa as células do tabuleiro
    cells = [];
    // Define o jogador atual como 'X' (o primeiro a jogar)
    currentPlayer = 'X';
    // Limpa o conteúdo do tabuleiro
    board.innerHTML = '';
    // Cria as células do tabuleiro
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = i;
        // Adiciona um evento de clique a cada célula do tabuleiro
        cell.addEventListener('click', () => handleCellClick(cell));
        cells.push(cell);
        board.appendChild(cell);
    }
};

// Função para tratar o clique em uma célula do tabuleiro
const handleCellClick = (cell) => {
    // Verifica se a célula está vazia
    if (!cell.textContent) {
        // Exibe o símbolo na célula correspondente ao jogador atual
        cell.textContent = currentPlayer;
        // Verifica se houve uma vitória após a última jogada
        checkGameStatus();
        // Marca as células vencedoras
        const winningCells = getWinningCells();
        if (winningCells.length > 0) {
            winningCells.forEach(cell => {
                // Adiciona a classe 'winning' ao elemento
                cell.classList.add('winning');
            });
        }
    }
};

// Função para verificar o status do jogo (vitória, empate ou continuação)
const checkGameStatus = () => {
    // Verifica se houve uma vitória
    if (checkWin()) {
        // Obtém as células vencedoras
        const winningCells = getWinningCells();
        // Atualiza o placar e exibe o vencedor com uma pausa de 500 milissegundos
        updateScoreAndDisplayWinner(winningCells, 500);
    } else if (checkDraw()) {
        // Verifica se houve um empate
        alert('Empate!');
        // Pergunta se os jogadores querem continuar jogando
        if (confirm('Deseja continuar jogando?')) {
            resetBoard();    
        }
    } else {
        // Muda para o próximo jogador
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

// Função para atualizar o placar e exibir o vencedor da rodada com pausa
const updateScoreAndDisplayWinner = (winningCells, pauseTime) => {
    // Executa uma pausa antes de atualizar o placar e exibir a mensagem de vitória
    setTimeout(() => {
        if (currentPlayer === 'X') {
            playerXScore++;
            playerXScoreDisplay.textContent = `${player1Name} (X): ${playerXScore}`;
        } else {
            playerOScore++;
            playerOScoreDisplay.textContent = `${player2Name} (O): ${playerOScore}`;
        }
        
        // Obtém o nome do vencedor
        const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
        
        // Exibe a mensagem de vitória
        alert(`Parabéns, ${winnerName}! Você ganhou esta rodada!`);
        
        // Verifica se os jogadores querem continuar jogando
        if (confirm('Deseja continuar jogando?')) {
            resetBoard();
        } else {
            // Exibe mensagem final informando quem ganhou com mais vitórias
            if (playerXScore > playerOScore) {
                alert(`O jogador ${player1Name} ganhou o jogo com ${playerXScore} vitórias!`);
            } else if (playerXScore < playerOScore) {
                alert(`O jogador ${player2Name} ganhou o jogo com ${playerOScore} vitórias!`);
            } else {
                alert(`O jogo terminou em empate! Ambos os jogadores têm ${playerXScore} vitórias.`);
            }
        }
    }, pauseTime);
};


// Função para verificar se houve um vencedor
const checkWin = () => {
    // Lista de combinações vencedoras possíveis
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Verifica se alguma combinação vencedora foi alcançada
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent) {
            return true; // Retorna verdadeiro se encontrar uma combinação vencedora
        }
    }

    return false; // Retorna falso se nenhuma combinação vencedora for encontrada
}

// Função para verificar se houve empate
const checkDraw = () => {
    // Verifica se todas as células estão preenchidas (empate)
    return cells.every(cell => cell.textContent);
};

// Função para encontrar e retornar as células vencedoras
const getWinningCells = () => {
    // Lista de combinações vencedoras possíveis
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Percorre as combinações vencedoras para encontrar as células correspondentes
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        // Verifica se as células contêm o mesmo símbolo (vencedor)
        if (cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent) {
            // Retorna as células vencedoras
            return [cells[a], cells[b], cells[c]];
        }
    }

    return []; // Retorna uma lista vazia se nenhuma célula for vencedora
};
