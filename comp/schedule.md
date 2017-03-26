---
title: $YYYY Match Schedule
layout: comp
angular_controller: MatchSchedule
---
{% raw %}

<style type="text/css">
td.chosen_team_match:nth-child(4n+3) { background-color: {{corners[0].colour|hexLighter:0.5}}; }
td.chosen_team_match:nth-child(4n+4) { background-color: {{corners[1].colour|hexLighter:0.5}}; }
td.chosen_team_match:nth-child(4n+5) { background-color: {{corners[2].colour|hexLighter:0.5}}; }
td.chosen_team_match:nth-child(4n+6) { background-color: {{corners[3].colour|hexLighter:0.5}}; }
</style>

# Match Schedule

This page shows the schedule of matches for the competition.
During most of the sessions teams earn [league points](/comp/league),
which are used to seed the the [knockout](/comp/knockout "An alternative, tree style, view of the knockouts") rounds.
The knockout rounds occur during the [last session](#last-session) of the competition

<div id="schedule-filter">
    Show matches for:
    <!--- NB: local width style as otherwise Select2 doesn't get it right -->
    <select data-ng-model="chosenTeam"
            data-ui-select2
            style="width:350px;"
            >
        <option value="">All Teams</option>
        <option data-ng-repeat="(tla, info) in teams"
                value="{{tla}}">
            {{info|teamName}}
        </option>
    </select>
    <label>
        Hide old matches:
        <input type="checkbox"
               data-ng-model="$storage.hideOldMatches"
               data-ng-checked="$storage.hideOldMatches"
            />
    </label>
</div>

<span data-ng-if="current_match != null">
The current match is <a href="#match-{{current_match}}">{{current_match}}</a>.
</span>

<div id="full_schedule">

<div class="match-session" markdown="1"
     data-ng-repeat="session in sessions">

<a id="last-session" data-ng-if="$last"></a>

## {{session.description}}

<table class="schedule">
    <colgroup class="meta" span="2" />
    <colgroup class="arena" span="4" data-ng-repeat="arena in session.arenas" />
    <thead>
        <tr>
            <th rowspan="2">Time  </th>
            <th rowspan="2">Match </th>
            <th data-ng-repeat="arena in session.arenas"
                style="color: {{arena.colour}};"
                colspan="4">Arena {{arena.display_name}}</th>
        </tr>
        <tr>
            <th data-ng-repeat-start="arena in session.arenas">Corner 0</th>
            <th>Corner 1</th>
            <th>Corner 2</th>
            <th data-ng-repeat-end>Corner 3</th>
        </tr>
    </thead>
    <tbody>
        <tr data-ng-repeat="match in session.matches|containsTeam:chosenTeam"
            data-ng-class="{current: match.num==current_match}"
            id="match-{{match.num}}">
            <td>{{match.time|date:'HH:mm:ss'}}</td>
            <td title="{{match.display_name}}">{{match.num}}</td>
            <td data-ng-repeat="team in match.teams track by $index"
                data-ng-class="{chosen_team_match: team==chosenTeam, no_match: !team}"
                title="{{team|teamInfo:teams|teamName}}">
                {{team}}
            </td>
        </tr>
    </tbody>
</table>

</div>

<!-- full_schedule -->
</div>
{% endraw %}