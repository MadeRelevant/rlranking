import {Command} from "./command";
import {Message} from "discord.js";
import {delay, inject, singleton} from "tsyringe";
import {Bot} from "../bot";

@singleton()
export class AddCommand implements Command {

    public name = 'add';
    public usage = 'add <win|loss|draw> <opponent-enemy> <score: 3-5>';

    constructor(@inject(delay(() => Bot)) private bot: Bot) {}

    public async run(msg: Message, args: string[]): Promise<void> {

        const type = args[0];
        const opponent = await this.bot.getUserFromMention(args[1]);
        const score = args[2];

        await msg.reply(`Adding ${type} ${msg.author.username} vs ${opponent.username} with score ${score}`);
    }
}
