export function GetClipTitle(clip_id: string): string {
    // 2022-04-30_01-00-55
    let d = GetTS(clip_id);
    if(d == null){
        return "Invalid date";
    }
    let date = d.toLocaleDateString();
    let time = d.toLocaleTimeString();
    return `${date} - ${time}`;
}

export function GetTS(clip_id: string): Date | null {
    let regexp = new RegExp(
        /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/
    );
    let m = clip_id.match(regexp);
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