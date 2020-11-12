import {Command} from "./command";
import {Message} from "discord.js";
import {CommandManager} from "./command-manager";
import {delay, inject, singleton} from "tsyringe";

@singleton()
export class HelpCommand implements Command {

    public name = 'help';
    public usage = 'help';

    constructor(@inject(delay(() => CommandManager)) private commands: CommandManager) {}

    public async run(msg: Message): Promise<void> {
        await msg.reply('Available commands: ' + this.commands.all().map(oneOf => oneOf.name).join(', '));
    }
}
