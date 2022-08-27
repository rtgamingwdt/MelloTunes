import voice, { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { ChannelType, CommandInteraction, EmbedBuilder, Guild, TextChannel, VoiceChannel } from "discord.js";
import MelloClient from "./MelloClient";
import Queue from "./type/Queue";
import search from "yt-search";
import Song from "./type/Song";
const ytdl = require("@distube/ytdl-core");

export default class MusicManager {
    client: MelloClient;
    queueMap: Map<string, Queue | null>;

    constructor(client: MelloClient) {
        this.client = client;
        this.queueMap = new Map<string, Queue | null>();
    }

    /**
     * Join a voice channel
     */
    public async joinVoiceChannel(interaction: CommandInteraction) {
        const embed = new EmbedBuilder();

        if ((await interaction.guild?.members.fetch(interaction.member!.user.id))!.voice.channel == null && interaction.options.get("channel") == null) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```Please join a voice channel or select a voice channel for me to join!```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }

        if ((await interaction.guild?.members.fetch(this.client.user!.id))?.voice.channel != null) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```I am already in a channel. Please ask someone with the MANAGE_CHANNELS permission to move me using the /move command```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const channel = interaction.options.get("channel") != null ? <VoiceChannel>interaction.options.get("channel")?.channel : <VoiceChannel>(await interaction.guild?.members.fetch(interaction.member?.user.id!))?.voice.channel;

        embed
            .setTitle("Success!")
            .setColor("Green")
            .setDescription(`\`\`\`Joining channel: ${channel.name}\`\`\``)
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] }).then(async () => {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild!.id,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
            });
            const serverQueue = this.queueMap.get(interaction.guild!.id);
            if (serverQueue != null) {
                serverQueue.connection = connection;
            }
            await (await interaction.guild?.members.fetch(this.client.user!.id))!.voice.setSuppressed(false);
        });
        return;
    }

    /**
     * Leave a voice channel
     */
    public async leaveVoiceChannel(interaction: CommandInteraction) {
        const embed = new EmbedBuilder();

        if ((await interaction.guild?.members.fetch(this.client.user!.id))?.voice.channel == null) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```I am currently not in a channel.```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const channel = <VoiceChannel>(await interaction.guild?.members.fetch(this.client.user!.id!))?.voice.channel;

        embed
            .setTitle("Success!")
            .setColor("Green")
            .setDescription(`\`\`\`Leaving channel: ${channel.name}\`\`\``)
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] }).then(async () => {
            this.queueMap.delete(interaction.guild!.id);
            (await interaction.guild?.members.fetch(this.client.user!.id))!.voice.disconnect();
        });
        const serverQueue = this.queueMap.get(interaction.guild?.id!);
        setTimeout(() => {
            if (serverQueue != null) {
                this.queueMap.delete(interaction.guild?.id!);
                embed
                    .setTitle("Deleted the Queue")
                    .setColor("Random")
                    .setDescription("I deleted the queue because I have been away from the vc for too long")
                    .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                    .setTimestamp();
                serverQueue.textChannel?.send({ embeds: [embed] });
            }
        }, 30000)
        return;
    }

    /**
     * Move to a voice channel
     */
    public async moveVoiceChannel(interaction: CommandInteraction) {
        const embed = new EmbedBuilder();

        if ((await interaction.guild?.members.fetch(interaction.member!.user.id))!.voice.channel == null && interaction.options.get("channel") == null) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```Please join a voice channel or select a voice channel for me to join!```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const channel = <VoiceChannel>(await interaction.guild?.members.fetch(interaction.member?.user.id!))?.voice.channel;

        embed
            .setTitle("Success!")
            .setColor("Green")
            .setDescription(`\`\`\`Joining channel: ${channel.name}\`\`\``)
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] }).then(async () => {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild!.id,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
            });
            const serverQueue = this.queueMap.get(interaction.guild!.id);
            if (serverQueue != null) {
                serverQueue.connection = connection;
            }
            await (await interaction.guild?.members.fetch(this.client.user!.id))!.voice.setSuppressed(false);
        });
        return;
    }

    /**
     * Play a song
     */
    public async play(interaction: CommandInteraction) {
        const serverQueue = this.queueMap.get(interaction.guild!.id);
        let song;
        const embed = new EmbedBuilder();
        const result = await search(<string>interaction.options.get("song")?.value!);
        const video = result.videos.length > 1 ? result.videos[0] : null;
        const info = ytdl.getInfo(video?.videoId!, {
            requestOptions: {
                headers: {
                    cookie: "VISITOR_INFO1_LIVE=gQoduOPEG-8; _gcl_au=1.1.1263612033.1649204067; SID=JgheSjJMMvcGGY-XthNGGe-iS1JepUOL_zpuslIvNmzdHLO1U1hTgyflntUVVbE_rwewfA.; __Secure-1PSID=JgheSjJMMvcGGY-XthNGGe-iS1JepUOL_zpuslIvNmzdHLO1Fo2OCTEcjSd_0FkFO_MWgw.; __Secure-3PSID=JgheSjJMMvcGGY-XthNGGe-iS1JepUOL_zpuslIvNmzdHLO1PmQcrbW3_nEjTTyouT8TjQ.; HSID=AH7k_LYI7Uo18hEsL; SSID=AYauEQQHee6hVURHh; APISID=9vuUzI7fza6ObiDa/AYDUwOLxh1Q3dew8E; SAPISID=dfHQac4sVRYHFBcg/A2wI6ZFMeYbcsRpK4; __Secure-1PAPISID=dfHQac4sVRYHFBcg/A2wI6ZFMeYbcsRpK4; __Secure-3PAPISID=dfHQac4sVRYHFBcg/A2wI6ZFMeYbcsRpK4; PREF=tz=America.New_York&f6=400&f5=20000&f4=4000000; LOGIN_INFO=AFmmF2swRQIhAIsZdNVQtM9lWLLwJBYfeMo2nNxS1Sg5JBgjIaxdKbw1AiA7Sn_XEb2-jPuVGqpTwqsZQMGiPnSsrorkiAb9cerugw:QUQ3MjNmeGpsY3JhZG1fODBVaFVZYUJEN1JJTXkzS21rVi1NQ0xBckpmTnVfdVF4elh6dVZLUmVhbGpzZFhyazdjNUxLM2ZEd093UFZnNTVXY1B6bF9IV2pBZ3Bzdm5aazBFcFpDV3pVUC05SU5HNXRqbk1RLXMwcjJUdmRDTk45U3dLNDBjRlg4NjU4azI4NlJZempUT2FIUXdJVV9MYWJB; YSC=Tj2S7Ob8_IU; SIDCC=AJi4QfG7JqwBMMq3czw2MFunTwcglpa2p-lFi-AxDc-2eb6z8sHZEhLS8oy-IbY1VOfbBMoNSBY; __Secure-3PSIDCC=AJi4QfF3pDlwD6sB_ESTeTDNUoC34-uAncxoJ-1KOJbJ2G_hJKJ-ag1DybG_XBMwZgljg36Z8Aw"
                }
            }
        });

        if (video) {
            song = new Song({ title: video.title, url: video.url, id: video.videoId, related: <string>(await info).related_videos[0].title });
        } else {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```Could not find the song. Please try a different song or try again later.```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }

        if (!serverQueue) {
            const channel = <TextChannel>interaction.channel;
            const voiceChannel = interaction.guild?.members.cache.get(interaction.user.id)?.voice.channel;
            if (voiceChannel == null) {
                embed
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("```Please join a voice channel```")
                    .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] })
            }

            const queue = new Queue({ voiceChannel: <VoiceChannel>voiceChannel, textChannel: channel, connection: null, player: null, songs: [], loop: "off", autoplay: false });
            this.queueMap.set(<string>interaction.guild?.id, queue);
            queue.songs.push(song);

            try {
                const player = createAudioPlayer();
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator
                }).setMaxListeners(1);
                connection.subscribe(player);
                queue.player = player;
                queue.connection = connection;
                this.videoFinder(interaction.guild!, queue.songs[0]).then(async () => {
                    if (voiceChannel.type == ChannelType.GuildStageVoice) {
                        await (await interaction.guild?.members.fetch(this.client.user!.id))?.voice.setSuppressed(false);
                    }
                });
                this.queueMap.set(interaction.guild!.id, queue);
                this.sendNowPlayingMessage(queue!);
            } catch (err) {
                console.log(err);
                this.queueMap.delete(interaction.guild!.id);
                console.error(err);
                embed
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("```I encountered an error while trying to play this song, please try again later.```")
                    .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            }

        } else {
            serverQueue.songs.push(song);
            embed
                .setTitle("Success!")
                .setColor("Green")
                .setDescription(`\`\`\`Added ${song.title} to the queue!\`\`\``)
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }

    /**
     * Skip a song
     */
    public async skip(interaction: CommandInteraction) {
        const serverQueue = this.queueMap.get(interaction.guild!.id);

        if (!serverQueue) {
            const embed = new EmbedBuilder();
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```There are currently no songs playing```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
        }
        serverQueue?.player!.stop();
    }

    /**
     * Loop a queue or song or just play normally
     */

    public async loop(interaction: CommandInteraction) {
        const serverQueue = this.queueMap.get(interaction.guild!.id);
        const embed = new EmbedBuilder();
        if (!serverQueue || serverQueue.songs.length == 0) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("There are currently no songs in the queue.")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }

        serverQueue.loop = <string>interaction.options.get("loop")?.value;
        embed
            .setTitle("Success")
            .setColor("Green")
            .setDescription(`Loop has been set to ${serverQueue.loop}`)
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] })
    }

    /**
     * Toggle Autoplay
     */
    public async autoplay(interaction: CommandInteraction) {
        const embed = new EmbedBuilder();
        const serverQueue = this.queueMap.get(interaction.guild!.id);
        if (serverQueue == null || serverQueue!.songs.length == 0) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("There are currently no songs in the queue")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios" })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
        serverQueue!.autoplay = !(serverQueue!.autoplay);

        embed
            .setTitle("Success")
            .setColor("Green")
            .setDescription(serverQueue?.autoplay == true ? "Autoplay has been enabled!" : "Autoplay has been disabled!")
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }

    /**
     * Stop queue
     */
    public async stop(interaction: CommandInteraction) {
        const serverQueue = this.queueMap.get(interaction.guild!.id);
        const embed = new EmbedBuilder();
        if (!serverQueue || serverQueue.songs.length == 0) {
            embed
                .setTitle("Error")
                .setColor("Red")
                .setDescription("```There are currently no songs in the queue")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }
        serverQueue.songs = [];
        serverQueue?.player!.stop();

        embed
            .setTitle("Success")
            .setColor("Green")
            .setDescription("Successfuly stopped playing Music!")
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    /** 
     * Find a song
    */
    private async videoFinder(guild: Guild, song: Song) {
        const serverQueue = this.queueMap.get(guild.id);

        if (!song) {
            const embed = new EmbedBuilder();
            embed
                .setTitle("Done for Now!")
                .setColor("Random")
                .setDescription("```Leaving the voice channel because there are no more songs left in the queue!```")
                .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                .setTimestamp();
            serverQueue?.textChannel!.send({ embeds: [embed] });
            await (await guild.members.fetch(this.client.user!.id))?.voice.disconnect();
            this.queueMap.delete(guild.id);
            return;
        }

        const stream = ytdl(<string>song.url, {
            filter: "audioonly",
            highWaterMark: 1 << 62,
            liveBuffer: 1 << 62,
            dlChunkSize: 0, //disabling chunking is recommended in discord bot
            quality: "highest",
            requestOptions: {
                headers: {
                    cookie: "VISITOR_INFO1_LIVE=gQoduOPEG-8; _gcl_au=1.1.1263612033.1649204067; SID=JgheSjJMMvcGGY-XthNGGe-iS1JepUOL_zpuslIvNmzdHLO1U1hTgyflntUVVbE_rwewfA.; __Secure-1PSID=JgheSjJMMvcGGY-XthNGGe-iS1JepUOL_zpuslIvNmzdHLO1Fo2OCTEcjSd_0FkFO_MWgw.; __Secure-3PSID=JgheSjJMMvcGGY-XthNGGe-iS1JepUOL_zpuslIvNmzdHLO1PmQcrbW3_nEjTTyouT8TjQ.; HSID=AH7k_LYI7Uo18hEsL; SSID=AYauEQQHee6hVURHh; APISID=9vuUzI7fza6ObiDa/AYDUwOLxh1Q3dew8E; SAPISID=dfHQac4sVRYHFBcg/A2wI6ZFMeYbcsRpK4; __Secure-1PAPISID=dfHQac4sVRYHFBcg/A2wI6ZFMeYbcsRpK4; __Secure-3PAPISID=dfHQac4sVRYHFBcg/A2wI6ZFMeYbcsRpK4; PREF=tz=America.New_York&f6=400&f5=20000&f4=4000000; LOGIN_INFO=AFmmF2swRQIhAIsZdNVQtM9lWLLwJBYfeMo2nNxS1Sg5JBgjIaxdKbw1AiA7Sn_XEb2-jPuVGqpTwqsZQMGiPnSsrorkiAb9cerugw:QUQ3MjNmeGpsY3JhZG1fODBVaFVZYUJEN1JJTXkzS21rVi1NQ0xBckpmTnVfdVF4elh6dVZLUmVhbGpzZFhyazdjNUxLM2ZEd093UFZnNTVXY1B6bF9IV2pBZ3Bzdm5aazBFcFpDV3pVUC05SU5HNXRqbk1RLXMwcjJUdmRDTk45U3dLNDBjRlg4NjU4azI4NlJZempUT2FIUXdJVV9MYWJB; YSC=Tj2S7Ob8_IU; SIDCC=AJi4QfG7JqwBMMq3czw2MFunTwcglpa2p-lFi-AxDc-2eb6z8sHZEhLS8oy-IbY1VOfbBMoNSBY; __Secure-3PSIDCC=AJi4QfF3pDlwD6sB_ESTeTDNUoC34-uAncxoJ-1KOJbJ2G_hJKJ-ag1DybG_XBMwZgljg36Z8Aw"
                }
            }
        });
        const resource = createAudioResource(stream);

        serverQueue?.player!.play(resource);
        serverQueue?.player!.on(AudioPlayerStatus.Idle, async () => {
            if (serverQueue.autoplay == false) {
                if (serverQueue.loop == "song") this.videoFinder(guild, serverQueue.songs[0]!);
                if (serverQueue.loop == "queue") {
                    serverQueue.songs.push(serverQueue.songs[0])
                    serverQueue.songs.shift();
                    this.videoFinder(guild, serverQueue.songs[0]);
                    this.sendNowPlayingMessage(serverQueue);
                }
                if (serverQueue.loop == "off") {
                    serverQueue.songs.shift();
                    this.videoFinder(guild, serverQueue.songs[0]);
                    this.sendNowPlayingMessage(serverQueue);
                }
            } else if (serverQueue.autoplay == true) {
                const result = await search(<string>serverQueue.songs[0].related);
                const video = result.videos.length > 1 ? result.videos[0] : null;
                const info = ytdl.getInfo(video?.videoId!);
                serverQueue.songs.push(new Song({ title: <string>video?.title, url: <string>video?.url, id: <string>video?.videoId, related: <string>(await info).related_videos[0].title }));
                serverQueue?.songs.shift();
                this.videoFinder(guild, serverQueue?.songs[0]!);
                this.sendNowPlayingMessage(serverQueue);
            } else {
                const embed = new EmbedBuilder();
                embed
                    .setTitle("Done for Now!")
                    .setColor("Random")
                    .setDescription("```Leaving the voice channel because there are no more songs left in the queue!```")
                    .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
                    .setTimestamp();
                serverQueue?.textChannel!.send({ embeds: [embed] });
                await (await guild.members.fetch(this.client.user!.id))?.voice.disconnect();
                this.queueMap.delete(guild.id);
                return;
            }
        });
    }

    private async sendNowPlayingMessage(serverQueue: Queue) {
        const embed = new EmbedBuilder();
        embed
            .setTitle("Now Playing")
            .setColor("Random")
            .setDescription(`\`\`\`Now Playing ${serverQueue.songs[0].title}\`\`\``)
            .setFooter({ text: "A Discord Bot by Developer Dungeon Studios!" })
            .setTimestamp();
        serverQueue?.textChannel!.send({ embeds: [embed] });
    }
}