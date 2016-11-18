angular
    .module('Main')
    .factory('Game', function(Soldier) {

        var game = {}

        game.init = function(rows, columns) {
            game.board = _.map(_.range(rows), function() { return Array(columns) })

            game.board[0][0] = Soldier(1, 0, 0)
            game.board[0][1] = Soldier(1, 0, 1)
            game.board[rows-1][0] = Soldier(2, 0, 0)
        }

        game.move = function(unit, destRow, destCol) {
            var canWalk = (
                destRow >= 0 &&
                destCol >= 0 &&
                destRow < game.board.length &&
                destCol < game.board[destRow].length &&
                unit.canWalk(destRow, destCol)
            )
            if (!canWalk) {
                return false
            }

            game.board[unit.row][unit.col] = null
            unit.row = destRow
            unit.col = destCol
            game.board[destRow][destCol] = unit

            // TODO: check if there's unit in dest and do units encounter
            return true
        }

        return game

    })
    .factory('BaseUnit', function() {

        var init = function(player, row, col) {
            var unit = {
                player: player,
                row: row,
                col: col,
                name: null,
                selected: false
            }

            unit.canWalk = function(destRow, destCol) {
                var isAdjacent = (
                    (destRow == unit.row - 1 && destCol == unit.col) ||
                    (destRow == unit.row + 1 && destCol == unit.col) ||
                    (destRow == unit.row && destCol == unit.col - 1) ||
                    (destRow == unit.row && destCol == unit.col + 1)
                )
                return isAdjacent;
            }

            return unit
        }

        return init

    })
    .factory('Flag', function(BaseUnit) {

        var init = function(player, row, col) {
            var flag = BaseUnit(player, row, col)
            flag.name = 'flag'

            flag.canWalk = function() {
                return false
            }

            return flag
        }

        return init

    })
    .factory('Soldier', function(BaseUnit) {

        var init = function(player, row, col) {
            var soldier = BaseUnit(player, row, col)
            soldier.name = 'soldier'

            soldier.canWalk = function(destRow, destCol) {
                var isStraight = (
                    (destRow != soldier.row && destCol == soldier.col) ||
                    (destRow == soldier.row && destCol != soldier.col)
                )
                return isStraight;
            }

            return soldier
        }

        return init

    })
