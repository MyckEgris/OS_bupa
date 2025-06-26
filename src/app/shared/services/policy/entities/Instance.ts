import { ResponseBase } from "./responseBase";

/**
 * Instance response
 */
export interface Instance<T> extends ResponseBase {
    element: T;
    elementList: T [];
}