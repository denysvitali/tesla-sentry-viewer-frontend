export function GetClipTitle(clipId: string): string {
    // 2022-04-30_01-00-55
    let d = GetTS(clipId);
    if(d == null){
        return "Invalid date";
    }
    let date = d.toLocaleDateString();
    let time = d.toLocaleTimeString();
    return `${date} - ${time}`;
}

export function GetTS(clipId: string): Date | null {
    let regexp = new RegExp(
        /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/
    );
    let m = clipId.match(regexp);
    if (m == null) {
        return null;
    }
    let d = new Date(0);
    d.setFullYear(parseInt(m[1]));
    d.setMonth(parseInt(m[2]) - 1);
    d.setDate(parseInt(m[3]));
    d.setHours(parseInt(m[4]));
    d.setMinutes(parseInt(m[5]));
    d.setSeconds(parseInt(m[6]));
    return d;
}

export function GetEventTimeStamp(timestampString: string): Date | null {
    let regexp = new RegExp(
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    let m = timestampString.match(regexp);
    if (m == null) {
        return null;
    }
    let d = new Date(0);
    d.setFullYear(parseInt(m[1]));
    d.setMonth(parseInt(m[2]) - 1);
    d.setDate(parseInt(m[3]));
    d.setHours(parseInt(m[4]));
    d.setMinutes(parseInt(m[5]));
    d.setSeconds(parseInt(m[6]));
    return d;
}