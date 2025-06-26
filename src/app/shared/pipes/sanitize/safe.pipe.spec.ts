import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafePipe', () => {
  it('sanitize an url', () => {
    const sanitize: DomSanitizer;
    const pipe = new SafePipe(sanitize);

    expect(pipe.transform('http://www.google.com', 'url')).toEqual('http://www.google.com');
  });
});
