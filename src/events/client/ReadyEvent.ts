import { Client } from "discord.js";
import Event from "../../abstract/Event";

export default class ReadyEvent extends Event {
  constructor() {
    super("ready", true);
  }

  public async execute(client: Client): Promise<void> {
    console.log(client.user?.username, "is logged in!");
  }
}
