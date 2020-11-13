import {Document} from "mongoose";

export interface Match extends Document {
    _id: String,
    guildId: string,
    created: Date,
    createdByUserId: string,
    opponentUserId: string,
    outcome: String,
    score: String
}
