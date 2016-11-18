angular
    .module('Main', [])
    .controller('MainController', function($scope, Game) {
        Game.init(4, 4)
        $scope.board = Game.board

        $scope.player = 1

        $scope.selectedUnit = null

        $scope.selectUnit = function(unit, destRow, destCol) {
            if ($scope.selectedUnit) {
                if (unit == $scope.selectedUnit || Game.move($scope.selectedUnit, destRow, destCol)) {
                    $scope.selectedUnit.selected = false
                    $scope.selectedUnit = null
                }
            }

            else if (unit && unit.player == $scope.player) {
                unit.selected = !unit.selected
                $scope.selectedUnit = unit
            }
        }
    })