import {Client} from "discord.js";
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
}
