import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class LoopCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("loop")
            .setDescription("Loop a song")
            .addStringOption((option) =>
                option
                    .setName("loop")
                    .setDescription("The loop type you want to be set to the queue")
                    .addChoices(
                        { name: "song", value: "song" },
                        { name: "queue", value: "queue" },
                        { name: "off", value: "off" }
                    )
                    .setRequired(true));
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.loop(interaction);
    }
}