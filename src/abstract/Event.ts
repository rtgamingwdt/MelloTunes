import { ClientEvents } from "discord.js";

type EventName = keyof ClientEvents;

export default abstract class Event {
  constructor(public readonly name: EventName, public readonly once: boolean) {}
  public abstract execute(...args: any[]): Promise<void>;
}
