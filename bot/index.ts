import {HelpCommand} from "./src/command/help.command";
import {Application} from "./src/application";

(async () => {

    const bot = new Application({
        botToken: '',

        // Prefix that all commands should start with
        prefix: '!rlranking'
    });

    bot.commands.register(new HelpCommand(bot.commands));


    await bot.init();
})();
