import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { TextChannel, VoiceChannel } from "discord.js";
import Song from "./Song";

export default class Queue {
    voiceChannel: VoiceChannel | null;
    textChannel: TextChannel | null;
    connection: VoiceConnection | null;
    player: AudioPlayer | null;
    songs: Song[];
    loop: string | null;
    autoplay: boolean | null;
    
    constructor({ voiceChannel, textChannel, connection, player, songs, loop, autoplay }: { voiceChannel: VoiceChannel | null, textChannel: TextChannel | null, connection: VoiceConnection | null, player: AudioPlayer | null, songs: Song[], loop: string | null, autoplay: boolean | null }) {
        this.voiceChannel = voiceChannel || null;
        this.textChannel = textChannel || null;
        this.connection = connection || null;
        this.player = player || null;
        this.songs = songs;
        this.loop = loop || "off";
        this.autoplay = autoplay || null;
    }
}