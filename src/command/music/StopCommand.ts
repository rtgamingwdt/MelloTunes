import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class StopCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("stop")
            .setDescription("Stop the bot from playing music and delete the queue")
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.stop(interaction);
    }
}