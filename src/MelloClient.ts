import { Client, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import MusicManager from "./MusicManager";
import Command from "./type/Command";
import Event from "./type/Event";

export default class MelloClient extends Client {
    config: {
        GUILD_ID: string;
        CLIENT_ID: string; TOKEN: string;
    };
    commands: RESTPostAPIApplicationCommandsJSONBody[];
    commandMap: Map<string, Command>;
    musicManager: MusicManager;

    constructor() {
        dotenv.config();

        super({
            intents:
                ["Guilds", "Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent"]
        });

        this.config = {
            TOKEN: <string>process.env.TOKEN!,
            CLIENT_ID: "1006726206747594862",
            GUILD_ID: process.env.GUILD_ID!
        }
        this.commands = [];
        this.commandMap = new Map<string, Command>();
        this.musicManager = new MusicManager(this);
    }

    public async build(): Promise<void> {
        this.login(this.config.TOKEN);
        this.handleEvents();
        this.handleCommands();
        // this.clearCommands();
    }

    public async handleEvents(): Promise<void> {
        const events = fs.readdirSync("src/event/");
        for (const event of events) {
            const eventFile = require(`./event/${event}`).default;
            const eventClass = new eventFile();

            if (eventClass.once) {
                this.once(eventClass.name, eventClass.execute.bind(null, this));
            } else {
                this.on(eventClass.name, eventClass.execute.bind(null, this));
            }
        }
    }

    public async handleCommands(): Promise<void> {
        fs.readdirSync("src/command").forEach((result1) => {
            fs.readdirSync(`src/command/${result1}`).forEach((result2) => {
                const command: Command = new (require(`./command/${result1}/${result2}`)).default;
                this.commands.push(command.get.toJSON());
                this.commandMap.set(command.get.name, command);
            });
        });

        const rest = new REST({ version: '10' }).setToken(this.config.TOKEN);

        (async () => {
            try {
                console.log('Reloading Slash Commands...');

                await rest.put(
                    Routes.applicationGuildCommands(this.config.CLIENT_ID, this.config.GUILD_ID),
                    { body: this.commands },
                );

                console.log('Successfully Reloaded Slash Commands!');
            } catch (error) {
                console.error(error);
            }
        })();
    }

    public async clearCommands() {
        const rest = new REST({ version: '10' }).setToken(this.config.TOKEN);
        rest.get(Routes.applicationGuildCommands(this.config.CLIENT_ID, this.config.GUILD_ID))
            .then(data => {
                const promises = [];
                for (const command of <any>data) {
                    const deleteUrl = `${Routes.applicationGuildCommands(this.config.CLIENT_ID, this.config.GUILD_ID)}/${command.id}`;
                    promises.push(rest.delete(<`/${string}`>deleteUrl));
                }
                return Promise.all(promises);
            });
    }
}