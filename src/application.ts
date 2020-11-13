import {ApplicationConfig} from "./application/config";
import {Dispatcher} from "./dispatcher";
import {container} from "tsyringe";
import {Bot} from "./bot";
import {Database} from "./database";

export class Application {
    private bot: Bot;
    private dispatcher: Dispatcher;

    constructor(public readonly config: ApplicationConfig) {

        container.register("config", {
            useValue: config
        });

        this.bot = container.resolve(Bot);
        this.dispatcher = container.resolve(Dispatcher);
    }

    public async init()
    {
        return Promise.all([
            this.bot.init(),
            container.resolve(Database).init()
        ]);
    }
}
