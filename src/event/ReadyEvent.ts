/**
 * Ready Event
 */
import MelloClient from "../MelloClient";
import Event from "../type/Event";

export default class ReadyEvent extends Event {
    
    constructor() {
        super("ready", false);
    }

    public async execute(client: MelloClient): Promise<void> {
        console.log(`${client.user!.tag}`);
    }
}