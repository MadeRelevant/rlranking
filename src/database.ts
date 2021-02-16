import {inject, singleton} from "tsyringe";
import {ApplicationConfig} from "./application/config";
import {Model, Mongoose, Schema} from "mongoose";
import {Match} from "./model/match";
import {RatingMutation} from "./model/rating-mutation";

@singleton()
export class Database {
    public Match: Model<Match>;
    public RatingMutation: Model<RatingMutation>;

    private readonly mongoose: Mongoose = require('mongoose');

    constructor(@inject('config') private config: ApplicationConfig) {
    }

    public async init(): Promise<void> {

        return this.mongoose.connect(this.config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(v => {
            this.initSchemas();
        })
    }

    private initSchemas() {
        this.initMatchSchema();
        this.initRatingMutationSchema();
    }

    private initMatchSchema() {
        this.Match = this.mongoose.model('Match', new Schema({
            guildId: {type: String, required: true},
            created: {type: Date, required: true},
            createdByUserId: {type: String, required: true},
            opponentUserId: {type: String, required: true},
            outcome: {type: String, required: true, enum: ['win', 'draw', 'loss']},
            score: {type: String, required: false}
        }));
    }

    private initRatingMutationSchema() {
        this.RatingMutation = this.mongoose.model('RatingMutation', new Schema({
            guildId: {type: String, required: true},
            created: {type: Date, required: true},
            userId: {type: String, required: true},
            mutation: {type: Number, required: true},
            matchId: {type: Number, required: false}
        }));
    }
}
