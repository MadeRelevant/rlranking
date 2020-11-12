import "reflect-metadata";
import {Dispatcher} from "../../src/dispatcher";
import {Message} from "discord.js";
import {Command} from "../../src/command/command";
import createSpy = jasmine.createSpy;

describe('dispatcher', () => {

    it ('ignores commands that do not match the prefix', () => {
        const cmd  = new Dispatcher([], {
            prefix: 'myprefix',
            botToken: null
        });

        const message = {
            content: 'bla',
            reply: createSpy('reply') as any
        } as Message;

        cmd.dispatch(message);
        expect(message.reply).not.toHaveBeenCalled();
    });

    it ('executes the given command', () => {

        const command = {
            name: 'test',
            run: createSpy('run') as any
        } as Command;

        const cmd  = new Dispatcher([command], {
            prefix: 'myprefix',
            botToken: null
        });

        const message = {
            content: 'myprefix test'
        } as Message;

        cmd.dispatch(message);
        expect(command.run).toHaveBeenCalledWith(message, []);
    });

    it ('passes additional arguments to command', () => {
        const command = {
            name: 'test',
            run: createSpy('run') as any
        } as Command;

        const cmd  = new Dispatcher([command], {
            prefix: 'myprefix',
            botToken: null
        });

        const message = {
            content: 'myprefix test arg1 arg2'
        } as Message;

        cmd.dispatch(message);
        expect(command.run).toHaveBeenCalledWith(message, ['arg1', 'arg2']);
    });

    it ('falls back on help command when no matching command was found', () => {
        const command = {
            name: 'help',
            run: createSpy('run') as any
        } as Command;

        const cmd  = new Dispatcher([command], {
            prefix: 'myprefix',
            botToken: null
        });

        const message = {
            content: 'myprefix some-non-existing-command'
        } as Message;

        cmd.dispatch(message);
        expect(command.run).toHaveBeenCalledWith(message, []);
    });

    it ('exception is thrown when invalid command is given and no help command is registered', async () => {

        const cmd  = new Dispatcher([], {
            prefix: 'myprefix',
            botToken: null
        });

        const message = {
            content: 'myprefix some-non-existing-command'
        } as Message;

        try {
            await cmd.dispatch(message);
            fail("Should have thrown an exception");
        } catch (e) {
            expect(e.message).toMatch(/Command not recognized/);
        }
    });

})
