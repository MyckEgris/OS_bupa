import { UserInformationService } from './user-information.service';

describe('UserInformationService', () => {
    let service: UserInformationService;

    beforeEach(() => {
        service = new UserInformationService();
    });

    it('User information does not exists', () => {
        expect(service.getUserInformation()).toBe(undefined);
    });

    it('Safe data in user information', () => {
        service.setUserInformation('juan', 'juan', 'Provider', ['Provider'], 'SPA');
        // expect(service.getUserInformation()).
    });
});
