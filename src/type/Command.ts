import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../MelloClient";

export default class Command {
    get: SlashCommandBuilder;

    constructor(builder: SlashCommandBuilder) {
        this.get = builder;
    }

    public async execute(client: MelloClient, interaction: CommandInteraction) {
        throw new Error(`Missing execute method in command ${this.get.name}`);
    }
}