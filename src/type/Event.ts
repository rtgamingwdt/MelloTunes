export default class Event {

    name: string
    once: boolean

    constructor(name: string, once: boolean) {
        this.name = name;
        this.once = once;
    }

    public async execute(...args: any[]): Promise<void> {
        throw new Error(`Missing execute method in event ${this.name}`);
    }
}