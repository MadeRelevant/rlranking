import {CommandManager} from "./command/command-manager";
import {Message} from "discord.js";
import {inject, singleton} from "tsyringe";
import {ApplicationConfig} from "./application/config";

@singleton()
export class Dispatcher {

    private readonly prefix: string

    constructor(private commands: CommandManager, @inject("config") config: ApplicationConfig) {
        this.prefix = config.prefix;
    }

    public async dispatch(msg: Message): Promise<void> {

        const parts = msg.content.split(' ');

        if (!this.accept(parts)) {
            return;
        }

        const commandName = parts[1].trim();
        const args = parts.slice(1);

        let command = this.commands.find(commandName);
        if (!command) {
            await msg.reply("Unrecognized command: " + commandName);
            command = this.commands.find('help');
        }

        await command.run(msg, args);
    }

    private accept(parts: string[]): boolean {
        let isTargetedToThisBot = parts.length > 1 && parts[0] === this.prefix;
        if (!isTargetedToThisBot) {
            return false;
        }

        const commandName = parts[1].trim();
        return this.commands.find(commandName) !== null;
    }
}
