import {Message} from "discord.js";

export interface Command {
    usage: string;
    name: string;
    run: (msg: Message, args: string[]) => Promise<void>
}
