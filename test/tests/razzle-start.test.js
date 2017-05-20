const shell = require('shelljs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');
const path = require('path');
const fs = require('fs');

shell.config.silent = true;

describe('razzle start', () => {
  describe('razzle basic example', () => {
    beforeEach(() => {
      shell.cd(path.join(util.rootDir, 'examples/basic'));
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server on :3000', () => {
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(
          'node_modules/razzle/bin/razzle.js start',
          () => {
            resolve(outputTest);
          }
        );
        child.stdout.on('data', data => {
          if (data.includes('> Started on port 3000')) {
            shell.exec('sleep 5');
            const output = shell.exec('curl -I localhost:3000');
            outputTest = output.stdout.includes('200');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBe(true));
    });

    afterEach(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});