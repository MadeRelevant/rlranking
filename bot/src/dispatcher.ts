import {CommandManager} from "./command/command-manager";
import {Message} from "discord.js";

export class Dispatcher {

    constructor(private commands: CommandManager, private prefix: string) {}

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
        if (isTargetedToThisBot) {
            return false;
        }

        const commandName = parts[1].trim();
        return this.commands.find(commandName) !== null;
    }
}
