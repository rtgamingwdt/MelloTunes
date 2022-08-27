import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class PlayCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("play")
            .setDescription("Play a song")
            .addStringOption((option) => option.setName("song").setDescription("The song you want to play").setRequired(true));
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.play(interaction);
    }
}