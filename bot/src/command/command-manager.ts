import {Command} from "./command";

export class CommandManager {

    private commands: Command[] = [];

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
