import "reflect-metadata";
import {HelpCommand} from "./src/command/help.command";
import {Application} from "./src/application";
import "dotenv-defaults/config"
import {container} from "tsyringe";

(async () => {

    container.register("commands", {useClass: HelpCommand});

    const bot = new Application({
        botToken: process.env.BOT_TOKEN,

        // Prefix that all commands should start with
        prefix: process.env.BOT_PREFIX
    });

    await bot.init();
})();
