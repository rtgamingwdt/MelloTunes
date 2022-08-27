import { CacheType, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import MelloClient from "../../MelloClient";
import Command from "../../type/Command";

export default class PingCommand extends Command {

    constructor() {
        const builder = new SlashCommandBuilder();
        builder
            .setName("ping")
            .setDescription("Get the ping of the bot.");
        super(builder);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction<CacheType>): Promise<void> {
        const embed = new EmbedBuilder()
        .setTitle("Ping")
        .setColor("White")
        .setDescription(`\`\`\`Ping is currently: ${client.ws.ping}ms\`\`\``)
        .setFooter({text: "A Discord Bot by Developer Dungeon Studios!"})
        .setTimestamp();
        await interaction.reply({embeds: [embed]});
    }
}