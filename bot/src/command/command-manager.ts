import {Command} from "./command";
import {injectAll, singleton} from "tsyringe";

@singleton()
export class CommandManager {

    constructor(@injectAll("commands") private readonly commands: Command[]) {
    }

    public find(name: string): Command | null {
        return this.commands.find(oneOf => oneOf.name === name) || null;
    }

    public register(command: Command): void {
        this.commands.push(command);
    }

    public all(): Command[] {
        return this.commands;
    }
}
