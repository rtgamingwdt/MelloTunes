export default class Song {
    title: string;
    url: string;
    id: string;
    related: string;

    constructor({ title, url, id, related }: { title: string, url: string, id: string, related: string }) {
        this.title = title;
        this.url = url;
        this.id = id;
        this.related = related;
    }
}