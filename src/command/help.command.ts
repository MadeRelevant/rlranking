import {Command} from "./command";
import {Message} from "discord.js";
import {delay, inject, singleton} from "tsyringe";
import {Dispatcher} from "../dispatcher";

@singleton()
export class HelpCommand implements Command {

    public name = 'help';
    public usage = 'help <command-name>';

    constructor(@inject(delay(() => Dispatcher)) private readonly dispatcher: Dispatcher) {}

    private get commands(): Command[] {
        return this.dispatcher.commands;
    }

    public async run(msg: Message, args: string[]): Promise<void> {

        const commandName = args[0] || null;
        let command;

        if (commandName && null !== (command = this.commands.find(oneOf => oneOf.name === commandName) || null)) {
            await this.showUsage(msg, command);
        } else {
            await this.listCommands(msg);
        }

    }

    private async showUsage(msg: Message, command: Command) {
        await msg.reply(`Usage info for: ${command.name}\n${command.usage}`);
    }

    private async listCommands(msg: Message) {
        await msg.reply('Available commands: ' + this.commands.map(oneOf => oneOf.name).sort().join(', '));
    }
}
