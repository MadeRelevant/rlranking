import {Message} from "discord.js";
import {inject, injectAll, singleton} from "tsyringe";
import {ApplicationConfig} from "./application/config";
import {Command} from "./command/command";

@singleton()
export class Dispatcher {

    private readonly prefix: string

    constructor(@injectAll("commands") public readonly commands: Command[], @inject("config") config: ApplicationConfig) {
        this.prefix = config.prefix;
    }

    public async dispatch(msg: Message): Promise<void> {

        const parts = msg.content.split(' ').filter(oneOf => !! oneOf.trim());

        if (!this.isPrefixMatching(parts)) {
            return;
        }

        const commandName = (parts[1] || '').trim();
        const args = parts.slice(2);

        let command = this.findCommandByName(commandName);
        if (!command && null === (command = this.findCommandByName('help'))) {
            throw new Error("Command not recognized and help command was not registered.. Application seems to have a misconfiguration")
        }

        msg.channel.startTyping();

        try {
            await command.run(msg, args);
        } catch (e) {
            console.warn("Failed to run command: ", e);
        }

        msg.channel.stopTyping(true);
    }

    private isPrefixMatching(parts: string[]): boolean {
        return parts.length > 0 && parts[0] === this.prefix;
    }

    private findCommandByName(name: string): Command | null {
        return this.commands.find(oneOf => oneOf.name === name) || null;
    }
}
