import { ChannelType, CommandInteraction } from "discord.js";
import MelloClient from "../MelloClient";
import Event from "../type/Event";

export default class InteractionCreateEvent extends Event {

    constructor() {
        super("interactionCreate", false);
    }

    public async execute(client: MelloClient, interaction: CommandInteraction): Promise<void> {
        if (interaction.channel!.type == ChannelType.DM) return;
        const command = client.commandMap.get(interaction.commandName);
        if (command != undefined) {
            command.execute(client, interaction);
        }
    }
}