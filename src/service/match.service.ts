import {singleton} from "tsyringe";
import {Database} from "../database";

export enum MatchOutcome {
    WIN = 'win',
    LOSS = 'loss',
    DRAW = 'draw'
}

@singleton()
export class MatchService {

    constructor(private db: Database) {
    }

    public resolveMatchOutcome(score: string): MatchOutcome {

        const scores = score.split('-');
        const myScore = scores[0] || 0;
        const theirScore = scores[1] || 0;

        if (myScore > theirScore) {
            return MatchOutcome.WIN;
        }

        if (myScore === theirScore) {
            return MatchOutcome.DRAW;
        }

        return MatchOutcome.LOSS;
    }

    async fetchLatest(guildId: string, limit: number) {
        return this.db.Match.find({
            guildId: guildId
        }).limit(20).exec()
    }
}
