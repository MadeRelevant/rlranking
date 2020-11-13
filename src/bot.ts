import {Client, User} from "discord.js";
import {inject, singleton} from "tsyringe";
import {Dispatcher} from "./dispatcher";
import {ApplicationConfig} from "./application/config";

@singleton()
export class Bot {

    private client: Client;

    constructor(private dispatcher: Dispatcher, @inject("config") private config: ApplicationConfig) {
        this.client = new Client();
    }

    public async init()
    {
        return new Promise((resolve, reject) => {
            this.client.on('ready', () => {
                console.log(`Logged in as ${this.client.user.tag}!`);
                resolve();
            });

            this.client.on('error', (e) => {
                reject(e);
            });

            this.client.on('message', async (msg) => {
                await this.dispatcher.dispatch(msg);
            });

            this.client.login(this.config.botToken);
        })
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

        return this.client.users.cache.get(mention) || await this.client.users.fetch(mention);
    }
}
