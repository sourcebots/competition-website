
var app = angular.module('app', ["ngResource", "competitionFilters"]);

app.controller("KnockoutMatches", function($scope, $resource) {
    var Arenas = $resource(API_ROOT + "/arenas");
    var Matches = $resource(API_ROOT + "/matches/knockouts");
    var Points = $resource(API_ROOT + "/scores/league");
    var Teams = $resource(SRWEB_ROOT + "teams-data.php");

    $scope.unknowable = "???";

    var updateTeams = function() {
        Teams.get(function(teams) {
            $scope.teams = teams;
        });
    };

    var updateState = function(CurrentMatch) {
        CurrentMatch.get(function(match) {
            $scope.current_match = match.number;
        });

        Points.get(function(points) {
            $scope.latest_scored_match = points.last_scored;
        });

        Matches.get(function(nodes) {
            $scope.rounds = nodes.rounds;
            for (var i=0; i<$scope.rounds.length; i++) {
                var round = $scope.rounds[i];
                var prefix = null;
                var rounds_after_this = $scope.rounds.length - i - 1;

                for (var j=0; j<round.length; j++) {
                    var match = round[j];
                    match.time = new Date(match.start_time);
                    match.description = "Match " + match.num;
                    if (rounds_after_this == 2) {
                        match.description = "Quarter " + j + " (#" + match.num + ")";
                    }
                    if (rounds_after_this == 1) {
                        match.description = "Semi " + j + " (#" + match.num + ")";
                    }
                    if (rounds_after_this == 0) {
                        match.description = "Final (match " + match.num + ")";
                    }
                    while (match.teams.length != 4) {
                        match.teams.push('-');
                    }
                }
            }
            $scope.knockout_started = nodes.started;
        });
    };

    Arenas.get(function(nodes) {
        $scope.arenas = nodes.arenas;
        var CurrentMatch = $resource(API_ROOT + "/matches/" + nodes.arenas[0] + "/current");
        var update = function() {
            updateState(CurrentMatch);
        };
        // refresh every 10s
        setInterval(update, 10000);
        update();
    });

    updateTeams();
    // refresh teams every minute
    setInterval(updateTeams, 60000);
});