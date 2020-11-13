import "reflect-metadata";
import {HelpCommand} from "./src/command/help.command";
import {Application} from "./src/application";
import "dotenv-defaults/config"
import {container} from "tsyringe";
import {ShowCommand} from "./src/command/show.command";
import {AddCommand} from "./src/command/add.command";

(async () => {

    container.register("commands", {useClass: HelpCommand});
    container.register("commands", {useClass: ShowCommand});
    container.register("commands", {useClass: AddCommand});

    const bot = new Application({
        botToken: process.env.BOT_TOKEN,

        // Prefix that all commands should start with
        prefix: process.env.BOT_PREFIX,

        mongoUri: process.env.MONGO_URI
    });

    console.log("Starting application");
    await bot.init();
    console.log("Up and running");
})();
