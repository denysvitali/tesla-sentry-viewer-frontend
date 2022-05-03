export type ClipResponse = {
    event: SentryEvent;
    clipFiles: {[key: string]: Array<string>};
};

export type SentryEvent = {
    timestamp: string;
    city: string;
    est_lat: string;
    est_lon: string;
    reason: string;
    camera: string;
};