import Discord from "discord.js";
import fs from "fs";
import { BOT_TOKEN } from "../config";
import Event from "../abstract/Event";

export default class Client extends Discord.Client {
  constructor() {
    super({
      intents: ["Guilds"],
    });
    this.login(BOT_TOKEN);
    this.loadEvents();
  }

  private loadEvents() {
    const eventsDirs = fs.readdirSync("src/events");
    for (const eventsDir of eventsDirs) {
      const events = fs.readdirSync(`src/events/${eventsDir}`);
      for (const event of events) {
        const evt: Event =
          new (require(`../events/${eventsDir}/${event}`).default)();
        evt.once
          ? this.once(evt.name, evt.execute.bind(this))
          : this.on(evt.name, evt.execute.bind(this));
      }
    }
  }
}
