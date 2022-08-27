import { joinVoiceChannel } from "@discordjs/voice";
import { CacheType, ChannelType, CommandInteraction, EmbedBuilder, SlashCommandBuilder, VoiceChannel } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class JoinCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder()
            .setName("join")
            .setDescription("Joins the voice channel that the user is currently in.")
            .addChannelOption((option) =>
                option.setName("channel")
                    .setDescription("The channel you want the bot to join to <optional>")
                    .addChannelTypes(ChannelType.GuildVoice))
            .setDefaultMemberPermissions(0);
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        client.musicManager.joinVoiceChannel(interaction);
    }
}