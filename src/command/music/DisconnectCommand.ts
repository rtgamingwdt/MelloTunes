import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class DisconnectCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("disconnect")
            .setDescription("Disconnect the bot from a vc")
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.leaveVoiceChannel(interaction);
    }
}