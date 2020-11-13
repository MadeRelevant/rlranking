import {Command} from "./command";
import {Message} from "discord.js";
import {delay, inject, singleton} from "tsyringe";
import {Bot} from "../bot";
import {Database} from "../database";

@singleton()
export class AddCommand implements Command {

    public name = 'add';
    public usage = 'add <opponent: @mentionMe> <score: 3-5>';

    constructor(@inject(delay(() => Bot)) private bot: Bot, private db: Database) {}

    public async run(msg: Message, args: string[]): Promise<void> {

        const opponent = await this.bot.getUserFromMention(args[0]);

        if (!opponent) {
            await msg.reply("Oops, it seems you didn't mention your opponent correclty, please try again");
            return;
        }

        const score = args[1];

        const match = new this.db.Match();
        match.created = new Date();
        match.createdByUserId = msg.author.id;
        match.opponentUserId = opponent.id;
        match.outcome = this.resolveMatchOutcome(score);
        match.guildId = msg.guild.id;
        match.score = score;
        await match.save()

        await msg.reply(`Match added: ${match.outcome} ${msg.author.username} vs ${opponent.username} with score ${score} - ${match._id}`);
    }

    private resolveMatchOutcome(score: string) {

        const scores = score.split('-');
        const myScore = scores[0] || 0;
        const theirScore = scores[1] || 0;

        if (myScore > theirScore) {
            return 'win';
        }

        if (myScore === theirScore) {
            return 'draw';
        }

        return 'loss';
    }
}
