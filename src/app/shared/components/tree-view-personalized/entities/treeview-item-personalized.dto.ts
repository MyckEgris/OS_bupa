import { TreeItem } from 'ngx-treeview';

/****
 * Interface created for mapped subject and show in the treeView
 * Extends of original TreeItem and add message for show one message
 */
export class TreeItemPersonalized implements TreeItem {
    text: string;
    value: any;
    message: string;
    subjectReference: string;
    disabled?: boolean;
    checked?: boolean;
    collapsed?: boolean;
    children?: TreeItem[];
}


