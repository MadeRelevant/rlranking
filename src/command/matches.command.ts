import {Command} from "./command";
import {Message, MessageEmbed} from "discord.js";
import {delay, inject, singleton} from "tsyringe";
import {Bot} from "../bot";
import moment from "moment";
import {MatchOutcome, MatchService} from "../service/match.service";
import {Match} from "../model/match";

@singleton()
export class MatchesCommand implements Command {

    public name = 'matches';
    public usage = `Syntax: matches
            Displays last 20 matches.`;

    constructor(@inject(delay(() => Bot)) private bot: Bot, private matchService: MatchService) {
    }

    public async run(msg: Message, args: string[]): Promise<void> {

        const matches = await this.matchService.fetchLatest(msg.guild.id, 20);

        if (matches.length === 0) {
            await msg.reply("You have not entered any matches (yet). Try out the 'add' command or 'help' command ;)");
            return;
        }

        const response = new MessageEmbed({
            color: '#0099ff',
            title: "Latest matches",
            fields: [
                {name: "Players", value: '\u200B', inline: true},
                {name: "Score", value: '\u200B', inline: true},
                {name: "When", value: '\u200B', inline: true},
            ]
        });

        for (const match of matches) {
            await this.addMatchRow(match, response);
        }

        await msg.reply(response);
    }

    private async addMatchRow(match: Match, response: MessageEmbed) {
        const createdBy = await this.bot.getUserById(match.createdByUserId);
        const opponent = await this.bot.getUserById(match.opponentUserId);

        let scoreLabel, winnerName, loserName;
        const outcome = this.matchService.resolveMatchOutcome(match.score);

        const scores = match.score.replace(' ', '').split('-');
        switch (outcome) {
            case MatchOutcome.WIN:
                scoreLabel = scores.join(' - ');
                winnerName = createdBy?.username;
                loserName = opponent?.username;
                break;
            case MatchOutcome.DRAW:
                scoreLabel = 'Draw'
                winnerName = createdBy?.username;
                loserName = opponent?.username;
                break;
            case MatchOutcome.LOSS:
                scoreLabel = scores.reverse().join(' - ');
                winnerName = opponent?.username;
                loserName = createdBy?.username;
                break;
        }

        response.addFields([
            {name: '\u200B', value: winnerName + ' vs ' + loserName, inline: true},
            {name: '\u200B', value: scoreLabel, inline: true},
            {name: '\u200B', value: moment(match.created).calendar(), inline: true}
        ])
    }
}
