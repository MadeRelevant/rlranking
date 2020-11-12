import {Command} from "./command";
import {Message} from "discord.js";
import {singleton} from "tsyringe";

@singleton()
export class ShowCommand implements Command {

    public name = 'show';
    public usage = 'show';

    public async run(msg: Message, args: string[]): Promise<void> {
        await msg.reply("TODO");
    }
}
