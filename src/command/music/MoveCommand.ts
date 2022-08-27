import { CacheType, ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class MoveCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("move")
            .setDescription("Move the bot to another voice channel")
            .addChannelOption((option) =>
                option
                    .setName("channel")
                    .setDescription("The channel you want me to join")
                    .addChannelTypes(ChannelType.GuildVoice));
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.moveVoiceChannel(interaction);
    }
}