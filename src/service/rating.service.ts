import {singleton} from "tsyringe";
import {Database} from "../database";
import {EloCalculator} from "./elo-calculator";
import {Snowflake} from "discord.js";
import {Rating} from "../model/rating";

@singleton()
export class RatingService {

    constructor(private db: Database, private eloCalculator: EloCalculator) {
    }

    async calculateMutation(playerUserId: Snowflake, opponentUserId: Snowflake, guildId: Snowflake): Promise<number> {
        const playerRating = await this.fetchPlayerRating(playerUserId, guildId);
        const opponentRating = await this.fetchPlayerRating(opponentUserId, guildId);

        return this.eloCalculator.calculateMutation(playerRating, opponentRating, true, 20);
    }

    async addMutation(userId: Snowflake, guildId: Snowflake, mutation: number): Promise<void> {
        if (mutation === 0) {
            return;
        }

        const model = new this.db.RatingMutation();
        model.created = new Date();
        model.guildId = guildId;
        model.mutation = mutation;
        model.userId = userId;
        await model.save();
    }

    async fetchPlayerRating(userId: Snowflake, guildId: Snowflake): Promise<number>
    {
        const results = await this.db.RatingMutation.aggregate([
            {
                $match: {
                    guildId,
                    userId
                }
            },
            {
                $group: {
                    _id: null,
                    total: {$sum: '$mutation'}
                },
            }
        ]);

        return (results[0]?.total || 0) + 1600;
    }

    async fetchLatest(guildId: Snowflake, limit: number) {
        return this.db.Match.find({
            guildId: guildId
        }).limit(20).exec()
    }

    public async fetchRanking(guildId: Snowflake): Promise<Rating[]> {
        return await this.db.RatingMutation.aggregate([
            {
                $match: {
                    guildId
                }
            },
            {
                $group: {
                    _id: "$userId",
                    rating: {$sum: '$mutation'}
                },
            },
            {
                '$sort': {'rating': -1}
            }

        ]) as Rating[];
    }
}
