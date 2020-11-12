import {HelpCommand} from "./src/command/help.command";
import {Application} from "./src/application";
import "dotenv-defaults/config"

(async () => {

    const bot = new Application({
        botToken: process.env.BOT_TOKEN,

        // Prefix that all commands should start with
        prefix: process.env.BOT_PREFIX
    });

    bot.commands.register(new HelpCommand(bot.commands));


    await bot.init();
})();
