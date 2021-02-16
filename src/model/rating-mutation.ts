import {Document} from "mongoose";

export interface RatingMutation extends Document {
    _id: String,
    guildId: string;
    created: Date,
    userId: string,
    mutation: number;
    matchId: number | null;
}
