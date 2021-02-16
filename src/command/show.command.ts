import {Command} from "./command";
import {Message, MessageEmbed} from "discord.js";
import {delay, inject, singleton} from "tsyringe";
import {Bot} from "../bot";
import {RatingService} from "../service/rating.service";
import moment from "moment";

@singleton()
export class ShowCommand implements Command {

    public name = 'show';
    public usage = 'show';

    constructor(@inject(delay(() => Bot)) private bot: Bot, private ratingService: RatingService) {}


    public async run(msg: Message, args: string[]): Promise<void> {

        const results = await this.ratingService.fetchRanking(msg.guild.id);

        const response = new MessageEmbed({
            color: '#0099ff',
            title: "Ranking",
            fields: [
                {name: "#", value: '\u200B', inline: true},
                {name: "Player", value: '\u200B', inline: true},
                {name: "Rating", value: '\u200B', inline: true}
            ]
        });

        let position = 1;
        for (const result of results) {

            const player = await this.bot.getUserById(result._id);
            response.addFields([
                {name: '\u200B', value: String(position++), inline: true},
                {name: '\u200B', value: player.username, inline: true},
                {name: '\u200B', value: result.rating + 1600, inline: true},
            ] as any);
        }

        await msg.reply(response);
    }
}
