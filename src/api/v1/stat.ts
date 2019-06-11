import { Team } from "./team";
import { Player } from "./player";
import { Game } from "./game";

// Generated by https://quicktype.io

export interface Stat {
    id:       number;
    ast:      number;
    blk:      number;
    dreb:     number;
    fg3_pct:  number;
    fg3a:     number;
    fg3m:     number;
    fg_pct:   number;
    fga:      number;
    fgm:      number;
    ft_pct:   number;
    fta:      number;
    ftm:      number;
    game:     Game;
    min:      string;
    oreb:     number;
    pf:       number;
    player:   Player;
    pts:      number;
    reb:      number;
    stl:      number;
    team:     Team;
    turnover: number;
}

