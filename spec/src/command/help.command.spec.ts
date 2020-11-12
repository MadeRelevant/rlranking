import "reflect-metadata"
import {HelpCommand} from "../../../src/command/help.command";
import {Command} from "../../../src/command/command";
import {Message} from "discord.js";
import createSpy = jasmine.createSpy;
import {Dispatcher} from "../../../src/dispatcher";

describe('commands', () => {

    describe('help', () => {

        it('lists all commands', () => {

            const cmd = new HelpCommand({
                commands: [
                    {name: 'cmd1'} as Command,
                    {name: 'cmd2'} as Command
                ]
            } as Dispatcher);

            const message = {
                reply: createSpy('reply') as any
            } as Message;

            cmd.run(message, []);
            expect(message.reply).toHaveBeenCalledOnceWith('Available commands: cmd1, cmd2');
        });

        it('sorts all commands by name', () => {

            const cmd = new HelpCommand({
                commands: [
                    {name: 'cmd2'} as Command,
                    {name: 'cmd1'} as Command
                ]
            } as Dispatcher);

            const message = {
                reply: createSpy('reply') as any
            } as Message;

            cmd.run(message, []);
            expect(message.reply).toHaveBeenCalledOnceWith('Available commands: cmd1, cmd2');
        });

        it('shows usage info if command was provided', () => {

            const cmd = new HelpCommand({commands: [
                    {name: 'test-command', usage: 'This is my usage info'} as Command,
                ]} as Dispatcher);

            const message = {
                reply: createSpy('reply') as any
            } as Message;

            cmd.run(message, ['test-command']);
            expect(message.reply).toHaveBeenCalledOnceWith("Usage info for: test-command\nThis is my usage info");
        })

    });
})
