export enum Language {
    ENG,
    SPA,
    EN = 1,
    ES = 2,
    PT = 7
}

export namespace Language {
    export function getDescription(language: Language): string {
        if (language === Language.EN) {
            return 'english';
        } else if (language === Language.ES) {
            return 'spanish';
        } else if (language === Language.PT) {
            return 'portuguese';
        }  else {
            return null;
        }
    }

}

