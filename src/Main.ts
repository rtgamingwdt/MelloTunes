import MelloClient from "./MelloClient";

class Main {

    public async main(): Promise<void> {
        new MelloClient().build();
    }
}

new Main().main();