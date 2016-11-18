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

        game.move = function(player, unit, destRow, destCol) {
            var targetUnit = game.board[destRow][destCol]

            var canWalk = (
                destRow >= 0 &&
                destCol >= 0 &&
                destRow < game.board.length &&
                destCol < game.board[destRow].length &&
                (!targetUnit || targetUnit.player != player) &&
                unit.canWalk(destRow, destCol)
            )
            if (!canWalk) {
                return false
            }

            game.board[unit.row][unit.col] = null
            unit.row = destRow
            unit.col = destCol

            if (!targetUnit) {
                game.board[destRow][destCol] = unit
            }
            else {
                var survivor = unit.encounter(targetUnit, game.killUnit)
                game.board[destRow][destCol] = survivor
            }

            return true
        }

        game.killUnit = function(unit) {
            game.board[unit.row][unit.col] = null
            // TODO: Add unit to some discarded units array
        }

        return game

    })
    .factory('BaseUnit', function() {

        var init = function(player, row, col) {
            var unit = {
                player: player,
                row: row,
                col: col,
                slug: null,
                power: null,
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

            unit.baseEncounter = function(targetUnit, killFn) {
                if (unit.power > targetUnit.power) {
                    killFn(targetUnit)
                    return unit
                }
                else if (unit.power < targetUnit.power) {
                    killFn(unit)
                    return targetUnit
                }
                else {
                    killFn(unit)
                    killFn(targetUnit)
                    return null
                }
            }

            return unit
        }

        return init

    })
    .factory('Flag', function(BaseUnit) {

        var init = function(player, row, col) {
            var flag = BaseUnit(player, row, col)
            flag.slug = 'flag'
            flag.power = 0

            flag.canWalk = function() {
                return false
            }

            return flag
        }

        return init

    })
    .factory('Bomb', function(BaseUnit) {

        var init = function(player, row, col) {
            var bomb = BaseUnit(player, row, col)
            bomb.slug = 'bomb'
            bomb.power = 99

            bomb.canWalk = function() {
                return false
            }

            return bomb
        }

        return init

    })
    .factory('Soldier', function(BaseUnit) {

        var init = function(player, row, col) {
            var soldier = BaseUnit(player, row, col)
            soldier.slug = 'soldier'
            soldier.power = 2

            soldier.canWalk = function(destRow, destCol) {
                var isStraight = (
                    (destRow != soldier.row && destCol == soldier.col) ||
                    (destRow == soldier.row && destCol != soldier.col)
                )
                return isStraight;
            }

            soldier.encounter = soldier.baseEncounter

            return soldier
        }

        return init

    })
    .factory('Gunsmith', function(BaseUnit) {

        var init = function(player, row, col) {
            var gunsmith = BaseUnit(player, row, col)
            gunsmith.slug = 'gunsmith'
            gunsmith.power = 3

            gunsmith.encounter = function(targetUnit, killFn) {
                if (targetUnit.slug == 'bomb') {
                    killFn(targetUnit)
                    return gunsmith
                }
                else {
                    return gunsmith.baseEncounter(targetUnit, killFn)
                }
            }

            return gunsmith
        }

        return init

    })
