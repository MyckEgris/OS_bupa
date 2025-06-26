import { HttpResponse } from '@angular/common/http';

export interface CacheEntry {
    url: string;
    response: any;
    entryTime: number;
}

export const MAX_CACHE_AGE = 3600000; // in milliseconds //1h -> 3600000
