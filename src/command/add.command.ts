import {Command} from "./command";
import {Message} from "discord.js";
import {delay, inject, singleton} from "tsyringe";
import {Bot} from "../bot";
import {Database} from "../database";
import {MatchOutcome, MatchService} from "../service/match.service";
import {RatingService} from "../service/rating.service";

@singleton()
export class AddCommand implements Command {

    public name = 'add';
    public usage = `Syntax: add <opponent: @mentionMe> <score: 3-5>
        For example when you won: add @SomeUser 3-0
        Or when you lost: add @SomeUser 1-3`;

    constructor(@inject(delay(() => Bot)) private bot: Bot, private db: Database, private matchService: MatchService, private ratingService: RatingService) {}

    public async run(msg: Message, args: string[]): Promise<void> {

        const opponent = await this.bot.getUserFromMention(args[0]);

        if (!opponent) {
            await msg.reply("Oops, it seems you didn't mention your opponent correclty, please try again");
            return;
        }

        // TODO dont allow entering matches against themselves

        const score = args[1];

        const match = new this.db.Match();
        match.created = new Date();
        match.createdByUserId = msg.author.id;
        match.opponentUserId = opponent.id;
        match.outcome = this.matchService.resolveMatchOutcome(score);
        match.guildId = msg.guild.id;
        match.score = score;
        await match.save();

        if (match.outcome === MatchOutcome.WIN) {
            const mutation = await this.ratingService.calculateMutation(match.createdByUserId, match.opponentUserId, match.guildId);

            await this.ratingService.addMutation(match.createdByUserId, match.guildId, mutation);
            await this.ratingService.addMutation(match.opponentUserId, match.guildId, mutation * -1);

        } else {
            const mutation = await this.ratingService.calculateMutation(match.opponentUserId, match.createdByUserId, match.guildId);

            await this.ratingService.addMutation(match.createdByUserId, match.guildId, mutation * -1);
            await this.ratingService.addMutation(match.opponentUserId, match.guildId, mutation);
        }

        await msg.reply(`Match added: ${match.outcome} ${msg.author.username} vs ${opponent.username} with score ${score} - ${match._id}`);
    }
}
