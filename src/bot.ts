import {Client, User} from "discord.js";
import {inject, singleton} from "tsyringe";
import {Dispatcher} from "./dispatcher";
import {ApplicationConfig} from "./application/config";

@singleton()
export class Bot extends Client {

    constructor(private dispatcher: Dispatcher, @inject("config") private config: ApplicationConfig) {
        super();
    }

    public async init()
    {
        this.on('ready', () => {
            console.log(`Logged in as ${this.user.tag}!`);
        });

        this.on('message', async (msg) => {
            await this.dispatcher.dispatch(msg);
        });

        await this.login(this.config.botToken);
    }

    public async getUserFromMention(mention: string): Promise<User | null> {
        if (!mention) {
            return null;
        }

        if (!mention.startsWith('<@') || !mention.endsWith('>')) {
            return null;
        }

        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return this.users.cache.get(mention) || await this.users.fetch(mention);
    }
}
