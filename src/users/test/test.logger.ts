import { Logger } from '@nestjs/common';

// used to disable logs during testing
export class TestLogger extends Logger {
  log(message: string) {} // eslint-disable-line @typescript-eslint/no-empty-function
  error(message: string, trace: string) {} // eslint-disable-line @typescript-eslint/no-empty-function
  warn(message: string) {} // eslint-disable-line @typescript-eslint/no-empty-function
  debug(message: string) {} // eslint-disable-line @typescript-eslint/no-empty-function
  verbose(message: string) {} // eslint-disable-line @typescript-eslint/no-empty-function
}
