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

    it ('strips empty arguments to command', () => {
        const command = {
            name: 'test',
            run: createSpy('run') as any
        } as Command;

        const cmd  = new Dispatcher([command], {
            prefix: 'myprefix',
            botToken: null
        });

        const message = {
            content: 'myprefix test arg1 arg2  arg3'
        } as Message;

        cmd.dispatch(message);
        expect(command.run).toHaveBeenCalledWith(message, ['arg1', 'arg2', 'arg3']);
    });

    describe ('fallback to help command', () => {

        let helpCommand;
        let dispatcher;

        beforeEach(() => {
            helpCommand = {
                name: 'help',
                run: createSpy('run') as any
            } as Command;

            dispatcher = new Dispatcher([helpCommand], {
                prefix: 'myprefix',
                botToken: null
            });
        })

        it ('falls back on help command when no matching command was found', () => {
            const message = {
                content: 'myprefix some-non-existing-command'
            } as Message;

            dispatcher.dispatch(message);
            expect(helpCommand.run).toHaveBeenCalledWith(message, []);
        });

        it ('falls back on help when nothing else than bot prefix was given', () => {
            const message = {
                content: 'myprefix'
            } as Message;

            dispatcher.dispatch(message);
            expect(helpCommand.run).toHaveBeenCalledWith(message, []);
        });

    })

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

    it ('starts and stops typing to indicate a command is running');

    it ('stops typing even when the command causes an error');
})
