import {Document} from "mongoose";
import {MatchOutcome} from "../service/match.service";

export interface Match extends Document {
    _id: String,
    guildId: string,
    created: Date,
    createdByUserId: string,
    opponentUserId: string,
    outcome: MatchOutcome,
    score: string
}
