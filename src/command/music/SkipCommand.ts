import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class SkipCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("skip")
            .setDescription("Skip a song");
        super(builder)
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.skip(interaction);
    }
}