import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class AutoplayCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("autoplay")
            .setDescription("Toggle autoplay")
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.autoplay(interaction);
    }
}