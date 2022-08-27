import { Message } from "discord.js";
import MelloClient from "../MelloClient";
import Event from "../type/Event";

export default class MessageCreateEvent extends Event {

    constructor() {
        super("messageCreate", false);
    }

    public async execute(client: MelloClient, message: Message): Promise<void> {
        // if(message.content.toLowerCase().startsWith("$ping".toLowerCase())) {
        //     message.channel.send("Pong!");
        //   }
    }
}