import {Client, Message} from "discord.js";
import {CommandManager} from "./command/command-manager";
import {ApplicationConfig} from "./application/config";
import {Dispatcher} from "./dispatcher";

export class Application {
    private client: Client;
    public readonly commands = new CommandManager();
    private dispatcher: Dispatcher;

    constructor(public readonly config: ApplicationConfig) {
        this.dispatcher = new Dispatcher(this.commands, this.config.prefix);
    }

    public async init()
    {
        await this.initClient();

        // TODO init mongo db connection etc
    }

    private async initClient() {
        this.client = new Client();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.on('message', async (msg) => {
            await this.dispatcher.dispatch(msg);
        });

        await this.client.login(this.config.botToken);
    }
}
