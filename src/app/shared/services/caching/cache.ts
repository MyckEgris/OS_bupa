import { HttpRequest, HttpResponse } from '@angular/common/http';

export abstract class Cache {
    abstract get(key: string): any | null;
    abstract put(key: string, res: any): void;
}
