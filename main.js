// coordinates of dots on the board
var dots = new Array(103, 283, 463);

// declare and initialize board
var board = new Array(19);
for (var i = 0; i < 19; i++) {
    board[i] = new Array(19).fill(0);
}

var prev_move = new Array(2).fill(-1);
var prev_ai_move = new Array(2).fill(-1);
var prev_human_move = new Array(2).fill(-1);
class Node {
    constructor() {
        this.move = -1;
        this.numerator = 0;
        this.denominator = 0;
        this.children = [];
    }
}


let app = Vue.createApp({
    data: function() {
        return {
            player: 1,
            board: board,
            board_width: 19,
            board_length: 19,
            has_won: false,
            game_ended: false,
            player_won: "black",
            prev_move: prev_move,
            prev_ai_move: prev_ai_move,
            prev_human_move: prev_human_move,
            dots: dots,
            move_n: 0,
            draw: false,
            running: false,
            win_prob: 50
        }
    },
    created() {
        console.log('Component is created')
    },
    mounted() {
        console.log('Component is mounted')
    },
    methods: {
        changeColor(i, j, player, event) {
            if (this.game_ended || this.running) {
                return;
            }
           
            // if no stones have been placed on this spot
            if (this.board[i][j] == 0) {
                this.board[i][j] = player;
                this.prev_move[0] = i;
                this.prev_move[1] = j;
                this.prev_human_move[0] = i;
                this.prev_human_move[1] = j;

                if (this.checkWinner(this.board, this.player, i, j, false)) {
                    return;
                }
                this.running = true;
                this.move_n++;
                if (this.move_n == 19 * 19) {
                    this.draw = true;
                    this.game_ended = true;
                }
                
                setTimeout (() => {
                    this.ai_move(this.board);     
                    this.running = false;  
                }, 0);
            }
        },
        transpose(matrix) {
            var b = new Array(19);
            for (var i = 0; i < 19; i++) {
                b[i] = new Array(19);
                for (var j = 0; j < 19; j++) {
                    b[i][j] = matrix[j][i];
                }
            }
            return b;
        },

        checkWinner(board, player, i, j, check) {
            // horizontal
            if (this.checkHorizontal(board, player, i, j, check)) {return true;}
            // vertical
            if (this.checkVertical(board, player, i, j, check)) {return true;}
            // diagonal \
            if (this.checkDiagonal(board, 19, player, i, j, check)) {return true;};

            // diagonal /
            return this.checkDiagonal_2(board, 19, player, i, j, check);
        },
        checkVertical(board, player, i, j, check) {
            var limit = Math.min(18, i + 4);
            var count = 0;
            for (var k = Math.max(0, i - 4); k <= limit; k++) {
                if (board[k][j] == player) {
                    count++
                } else {
                    count = 0;
                }
                if (count >= 5) {
                    if (!check) {
                        this.player_won = this.get_winner(player);
                        this.has_won = true;
                        this.game_ended = true;
                    }
                    return true;
                }
            }

            return false;
        },
        
        checkHorizontal(board, player, i, j, check) {
            var limit = Math.min(18, j + 4);
            var count = 0;
            for (var k = Math.max(0, j - 4); k <= limit; k++) {
                if (board[i][k] == player) {
                    count++
                } else {
                    count = 0;
                }
                if (count >= 5) {
                    if (!check) {
                        this.player_won = this.get_winner(player);
                        this.has_won = true;
                        this.game_ended = true;
                    }
                    return true;
                }
            }

            return false;
        },
        checkDiagonal(board, dimension, player, i, j, check) {
            var lower = Math.min(Math.min(i, j), 4);
            var upper = Math.min(Math.min(18 - i, 18 - j), 4);
            var count = 0;
            while (lower >= -upper) {
                if (board[i - lower][j - lower] == player) {
                    count++;
                } else {
                    count = 0;
                }
                if (count == 5) {
                    if (!check) {
                        this.player_won = this.get_winner(player);
                        this.has_won = true;
                        this.game_ended = true;
                    }
                    return true;
                }
                lower--;
            }
            return false;
        },
        checkDiagonal_2(board, dimension, player, i, j, check) {
            var lower = Math.min(Math.min(18 - i, j), 4);
            var upper = Math.min(Math.min(i, 18 - j), 4);
            var count = 0;
            while (lower >= -upper) {
                if (board[i + lower][j - lower] == player) {
                    count++;
                } else {
                    count = 0;
                }
                if (count == 5) {
                    if (!check) {
                        this.player_won = this.get_winner(player);
                        this.has_won = true;
                        this.game_ended = true;
                    }
                    return true;
                }
                lower--;
            }
            return false;
        },

        get_winner(player) {
            return player == 1 ? "black" : "white";
        },

        reset() {
            for (var i = 0; i < 19; i++) {
                for (var j = 0; j < 19; j++) {
                    this.board[i][j] = 0;
                }
            }

            this.has_won = false;
            this.game_ended = false;
            this.draw = false;
            this.player = 1;
            this.prev_move[0] = -1;
            this.prev_move[1] = -1;
            this.prev_human_move[0] = -1;
            this.prev_human_move[1] = -1;
            this.prev_ai_move[0] = -1;
            this.prev_ai_move[1] = -1;
            this.move_n = 0;
            this.win_prob = 50;
        },

        undo() {
            if (this.prev_move[0] != -1) {
                this.board[this.prev_human_move[0]][this.prev_human_move[1]] = 0;
                this.board[this.prev_ai_move[0]][this.prev_ai_move[1]] = 0;
                this.prev_move[0] = -1;
                this.prev_move[1] = -1;
                this.prev_human_move[0] = -1;
                this.prev_human_move[1] = -1;
                this.prev_ai_move[0] = -1;
                this.prev_ai_move[1] = -1;
                this.move_n--;
            }
            this.player = this.player;
            this.has_won = false;
            this.game_ended = false;
            this.draw = false;
        },
        get_dot_style(i, j) {
            return "margin-left:" + `${i}px`+ ";" + "margin-top:" + `${j}px`+ ";"
            
        },

        get_class(state) {
            //console.log(state)
            var c = "";
            if (state == 0) {
                c = "box ";
            } else if (state == 1) {
                c = "black ";
            } else {
                c = "white ";
            }

            return c + "border ";
        },

        ai_move(board) {
            var root = this.mcst(this.copy(board)); // get monte carlo search tree
            var move = this.get_move(root);

            this.board[Math.floor(move / 19)][move % 19] = -1;
            this.prev_ai_move[0] = Math.floor(move / 19);
            this.prev_ai_move[1] = move % 19;
            this.prev_move[0] = Math.floor(move / 19);
            this.prev_move[1] = move % 19;

            this.checkWinner(this.board, -1, Math.floor(move / 19), move % 19, false);
            
        },
        get_move(root) {
            var max_i = -1;
            var max_val = -1;
            var win_percentage = 0;

            for (var i = 0; i < root.children.length; i++) {
                var c = root.children[i];
                //console.log(i, Math.floor(c.move / 19), c.move % 19, c.numerator, c.denominator, c.numerator/ c.denominator);
                if (c.denominator > max_val) {
                    max_val = c.denominator;
                    win_percentage = c.numerator / c.denominator;
                    max_i = i;
                }
            }
            //console.log("max", Math.floor(root.children[max_i].move / 19), root.children[max_i].move % 19);
            if (root.children[max_i].denominator != 1 || root.children[max_i].numerator != 1) {
                this.win_prob = (100 - win_percentage * 100).toFixed(2);
            }
            return root.children[max_i].move;
        },

        prev_m(index, idx) {
            if (this.prev_move[0] == index && this.prev_move[1] == idx) {
                return true;
            }
            return false;
        },

        mcst(board) {
            var root = new Node();
            var available = this.get_available(board);
            
            // find ai consecutive 4
            for (var i = 0; i < available.length; i++) {
                var b = this.copy(board);
                let move = available[i];
                b[Math.floor(move / 19)][move % 19] = -1;
                if (this.checkWinner(b, -1, Math.floor(move / 19), move % 19, true)) {
                    let node = new Node();
                    node.move = move;
                    node.numerator = 1;
                    node.denominator = 1;
                    root.children.push(node);
                    console.log("ai wins");
                    return root;
                }
            }
            

            // find human consecutive 4
            for (var i = 0; i < available.length; i++) {
                var b = this.copy(board);
                let move = available[i];
                b[Math.floor(move / 19)][move % 19] = 1;
                if (this.checkWinner(b, 1, Math.floor(move / 19), move % 19, true)) {
                    let node = new Node();
                    node.move = move;
                    node.numerator = 1;
                    node.denominator = 1;
                    root.children.push(node);
                    console.log("human 4");
                    return root;
                }
            }

            var live = [];
            // find ai moves that will form a live 4 in the next turn
            for(var i = 0; i < available.length; i++) {
                var b = this.copy(board);
                var move = available[i];
                b[Math.floor(move / 19)][move % 19] = -1;
                if (this.live_4(Math.floor(move / 19), move % 19, -1, b)) {
                    live.push(move);
                }
            }
            if (live.length != 0) {
                console.log("ai live 4 next");
                for (var i = 0; i < live.length; i++) {
                    let node = new Node();
                    node.move = live[i];
                    root.children.push(node);
                }
            }

            var live_opponent = [];
            // find human moves that will form a live 4 in the next turn
            for(var i = 0; i < available.length; i++) {
                var b = this.copy(board);
                var move = available[i];
                b[Math.floor(move / 19)][move % 19] = 1;
                if (this.live_4(Math.floor(move / 19), move % 19, 1, b)) {
                    live_opponent.push(move);
                }
            }

            if (live_opponent.length != 0) {
                console.log("human live 4 next");
                for (var i = 0; i < live_opponent.length; i++) {
                    let node = new Node();
                    node.move = live_opponent[i];
                    root.children.push(node);
                }
            }  else {
                // find all moves within the same block as existing stones
                for (var i = 0; i < available.length; i++) {
                    let node = new Node();
                    node.move = available[i];
                    root.children.push(node);
                }
            }

            for (var i = 0; i < 30000; i++) {
                let update = this.traverse(this.copy(board), root, 1);
                root.numerator += update;
                root.denominator += 1;
                if (i % 10000 == 0) {
                    console.log(i);
                }
            }
            return root;

        },
        traverse(board, root, player) {
            // at leaf node
            if (root.children.length == 0) {
                if (root.denominator != 0) {
                    var available = this.get_available(board);
                    for (var i = 0; i < available.length; i++) {
                        let node = new Node();
                        node.move = available[i];
                        root.children.push(node);
                    }
                    root = root.children[0];
                }
                // simulate and return backpropogate results
                let result = this.simulate(this.copy(board), player);
                root.numerator += +result;
                root.denominator += 1;

                return result;
            }
        
            // not at leaf node
            // find children with the highest ucb
            var max_ucb = -1;
            var max_i = -1; // index of the children with the highest ucb
            for (var i = 0; i < root.children.length; i++) {
                // if children has not been visited before
                if (root.children[i].denominator == 0) {
                    max_i = i;
                    break;
                }
                var ucb = this.get_ucb(root, root.children[i]);
        
                if (ucb > max_ucb) {
                    max_i = i;
                    max_ucb = ucb;
                }
            }
        
            if (root.move != -1) {
                board[Math.floor(root.move / 19)][root.move % 19] = player;
            }
            // backpropogate simulation results
            var update = this.traverse(board, root.children[max_i], -player);
            root.numerator += update;
            root.denominator += 1;
            
            return update;
        },

        get_ucb(root, child) {
            return child.numerator / child.denominator + 1.96
            * Math.sqrt(Math.log(root.denominator) / child.denominator);
        },


        live_4(i, j, player, board) {
            //horizontal
            var limit = Math.min(18, j + 3);
            var count = 0;
            for (var k = Math.max(0, j - 3); k <= limit; k++) {
                if (board[i][k] == player) {
                    count++
                } else {
                    count = 0;
                }
                if (count == 4) {
                    if (k > 3 && (board[i][k - 4] == 0) && k < 18 && (board[i][k + 1] == 0)) {
                        console.log("horizontal");
                        return true;
                    }
                }
            }

            //vertical
            var limit = Math.min(18, i + 3);
            var count = 0;
            for (var k = Math.max(0, i - 3); k <= limit; k++) {
                if (board[k][j] == player) {
                    count++
                } else {
                    count = 0;
                }
                if (count == 4) {
                    if (k > 3 && (board[k - 4][j] == 0) && k < 18 && (board[k + 1][j] == 0)) {
                        console.log("vertical");
                        return true;
                    }
                }
            }

            // diagonal \
            var lower = Math.min(Math.min(i, j), 3);
            var upper = Math.min(Math.min(18 - i, 18 - j), 3);
            var count = 0;
            var low = lower;
            while (lower >= -upper) {
                if (board[i - lower][j - lower] == player) {
                    count++;
                } else {
                    count = 0;
                }
                if (count == 4) {
                    var min = Math.min(i - lower - 4, j - lower - 4);
                    var max = Math.max(i - lower + 1, j - lower + 1);
                    if (min >= 0 && (board[i - lower - 4][j - lower - 4] == 0) && max <= 18 && (board[i - lower + 1][j - lower + 1] == 0)) {
                        console.log("diagonal \\");
                        return true;
                    }
                }
                lower--;
            }

            // diagonal /
            var lower = Math.min(Math.min(18 - i, j), 3);
            var upper = Math.min(Math.min(i, 18 - j), 3);
            var count = 0;
            var low = lower;
            while (lower >= -upper) {
                if (board[i + lower][j - lower] == player) {
                    count++;
                } else {
                    count = 0;
                }
                if (count == 4) {
                    var min = Math.min(i - lower + 4, j - lower - 4);
                    var max = Math.max(i - lower - 1, j - lower + 1);
                    if (min >= 0 && (board[i + lower + 4][j - lower - 4] == 0) && max <= 18 && (board[i + lower - 1][j - lower + 1] == 0)) {
                        console.log("diagonal /");
                        return true;
                    }
                }
                lower--;
            }

            return false;
            
        },
        
        get_available(board) { 
            var range = 1;
            var available = [];
            for (var i = 0; i < 19; i++) {
                for (var j = 0; j < 19; j++) {
                    if (board[i][j] != 0) {
                        for (var p = Math.max(i - range, 0); p <= Math.min(i + range, 18); p++) {
                            for (var k = Math.max(j - range, 0); k <= Math.min(j + range, 18); k++) {
                                if (board[p][k] == 0 && available.indexOf(p * 19 + k) == -1) {
                                    available.push(p * 19 + k);
                                }
                            }
                        }
                    }
                }
            }
            return available;
        },

        get_all_available(board) {
            var available = [];
            for (var i = 0; i < 19; i++) {
                for (var j = 0; j < 19; j++) {
                    if (board[i][j] == 0) {
                        available.push(i * 19 + j);
                    }
                }
            }

            return available;
        },

        // simulate the game randomly until someone wins
        simulate(board, p) {
            // get all availables moves
            var available = this.get_all_available(board);
        
            var player = p;
            // randomly place stones until someone wins
            while (true) {
                // randomly sample move
                if (available.length == 0) {
                    return 0.5;
                }
                var idx = Math.round(Math.random() * (available.length - 1));
                var move = available[idx];
                var temp = available[idx];

                // remove move from available
                available[idx] = available[available.length - 1];
                available[available.length - 1] = temp;
                available.pop();

                var current_i = Math.floor(move / 19);
                var current_j = move % 19;
                board[current_i][current_j] = player;
                // check if the player at this turn has won
                if (this.checkWinner(board, player, current_i, current_j, true)) {
                    return (player == -1);
                }
                player = -player;
            }
        },

        copy(board) {
            var b = new Array(19);
            for (var i = 0; i < 19; i++) {
                b[i] = board[i].slice(0);
            }
            return b;
        }

        

    }
})

app.mount('#app')
