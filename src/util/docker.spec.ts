/* eslint-disable */
// @ts-nocheck

import 'should';
import { Docker } from './docker';

describe('Docker', function() {

  const stdoutOutput = 'some stdout output';
  const stderrOutput = 'some stderr output';
  const testErr = new Error('Some error!');
  const testCloseStatusCode = 1;
  const args = ['-t', '-i'];

  it('should be a constructor', function() {
    Docker.should.be.a.constructor();
  });
  describe('Docker.run', function() {
    const docker = new Docker({});
    const image = 'someimage';

    it('should call `docker run [args] [image]`', function() {
      const fakeSpawn = new FakeSpawn();
      docker._spawn = fakeSpawn.spawn;
      docker.run(image, args);
      fakeSpawn.getSpawned().should.equal(`docker run ${args.join(' ')} ${image}`);
    });
    it('should pass any stdout output into the onOutput callback', async function() {
      const fakeSpawn = new FakeSpawn(stdoutOutput, stderrOutput);
      docker._spawn = fakeSpawn.spawn;
      const output = await new Promise(resolve => {
        const outputArr = [];
        docker.run(image, args, output => {
          outputArr.push(output);
          if(outputArr.length === 2) resolve(outputArr);
        });
      });
      output.includes(stdoutOutput).should.be.True();
      output.includes(stderrOutput).should.be.True();
    });
    it('should pass any error into the onErr callback', async function() {
      const fakeSpawn = new FakeSpawn('', '', testErr);
      docker._spawn = fakeSpawn.spawn;
      const err = await new Promise(resolve => {
        docker.run(image, args, null, resolve);
      });
      err.should.equal(testErr);
    });
    it('should call the onClose callback with status code on close', async function() {
      const fakeSpawn = new FakeSpawn(null, null, null, testCloseStatusCode);
      docker._spawn = fakeSpawn.spawn;
      const code = await new Promise(resolve => {
        docker.run(image, args, null, null, resolve);
      });
      code.should.equal(testCloseStatusCode);
    });

  });

  describe('Docker.exec', function() {
    const docker = new Docker({});
    const container = 'somecontainer';
    const command = '/bin/bash';
    it('should call `docker exec [args] [container] [command]`', function() {
      const fakeSpawn = new FakeSpawn();
      docker._spawn = fakeSpawn.spawn;
      docker.exec(container, args, command);
      fakeSpawn.getSpawned().should.equal(`docker exec ${args.join(' ')} ${container} ${command}`);
    });
    it('should pass any stdout output into the onOutput callback', async function() {
      const fakeSpawn = new FakeSpawn(stdoutOutput, stderrOutput);
      docker._spawn = fakeSpawn.spawn;
      const output = await new Promise(resolve => {
        const outputArr = [];
        docker.exec(container, args, command, output => {
          outputArr.push(output);
          if(outputArr.length === 2) resolve(outputArr);
        });
      });
      output.includes(stdoutOutput).should.be.True();
      output.includes(stderrOutput).should.be.True();
    });
    it('should pass any error into the onErr callback', async function() {
      const fakeSpawn = new FakeSpawn('', '', testErr);
      docker._spawn = fakeSpawn.spawn;
      const err = await new Promise(resolve => {
        docker.exec(container, args, command, null, resolve);
      });
      err.should.equal(testErr);
    });
    it('should call the onClose callback with status code on close', async function() {
      const fakeSpawn = new FakeSpawn(null, null, null, testCloseStatusCode);
      docker._spawn = fakeSpawn.spawn;
      const code = await new Promise(resolve => {
        docker.exec(container, args, command, null, null, resolve);
      });
      code.should.equal(testCloseStatusCode);
    });
  });

  describe('Docker.containerInspect', function() {
    const docker = new Docker({});
    const containerName = 'testcontainer';
    it('should return a promise', function() {
      const fakeExecFile = new FakeExecFile();
      docker._execFile = fakeExecFile.execFile;
      docker.containerInspect(containerName).should.be.a.Promise();
    });
    it('should call `docker container inspect --format "{{json .}}" [container name]`', function() {
      const fakeExecFile = new FakeExecFile();
      docker._execFile = fakeExecFile.execFile;
      docker.containerInspect(containerName);
      fakeExecFile.getExecuted().should.equal(`docker container inspect --format "{{json .}}" ${containerName}`);
    });
    it('should resolve the promise with a parsed object of container information', async function() {
      const testOutput = '"' + JSON.stringify({State: {Running: true}}) + '"';
      const fakeExecFile = new FakeExecFile(testOutput);
      docker._execFile = fakeExecFile.execFile;
      const output = await docker.containerInspect(containerName);
      output.should.be.an.Object();
      output.State.Running.should.be.True();
    });
    it('should resolve with an empty object on error', async function() {
      const fakeExecFile = new FakeExecFile('', new Error('something'));
      docker._execFile = fakeExecFile.execFile;
      const output = await docker.containerInspect(containerName);
      output.should.be.an.Object();
      Object.keys(output).length.should.equal(0);
    });
  });

  describe('Docker.containerStats', function() {
    const docker = new Docker({});
    const containerName = 'testcontainer';
    it('should return a promise', function() {
      const fakeExecFile = new FakeExecFile();
      docker._execFile = fakeExecFile.execFile;
      docker.containerStats(containerName).should.be.a.Promise();
    });
    it('should call `docker container stats --no-stream --no-trunc --format "{{json .}}" [container name]`', function() {
      const fakeExecFile = new FakeExecFile();
      docker._execFile = fakeExecFile.execFile;
      docker.containerStats(containerName);
      fakeExecFile.getExecuted().should.equal(`docker container stats --no-stream --no-trunc --format "{{json .}}" ${containerName}`);
    });
    it('should resolve the promise with a parsed object of container stats', async function() {
      const testOutput = '"' + JSON.stringify({Container: containerName}) + '"';
      const fakeExecFile = new FakeExecFile(testOutput);
      docker._execFile = fakeExecFile.execFile;
      const output = await docker.containerStats(containerName);
      output.should.be.an.Object();
      output.Container.should.equal(containerName);
    });
    it('should resolve with an empty object on error', async function() {
      const fakeExecFile = new FakeExecFile('', new Error('something'));
      docker._execFile = fakeExecFile.execFile;
      const output = await docker.containerStats(containerName);
      output.should.be.an.Object();
      Object.keys(output).length.should.equal(0);
    });
  });

});

function FakeSpawn(testOutput?: string, testErrOutput?: string, testErr?: Error, closeStatusCode?: number) {

  let spawned;

  this.getSpawned = function() {
    return spawned;
  }

  this.spawn = function(command: string, args: string[]) {
    const events = {};
    const stdoutEvents = {};
    const stderrEvents = {};

    spawned = command + ' ' + args.join(' ');

    setTimeout(() => {
      if(events['error'])
        events['error'](testErr);
    }, 5);
    setTimeout(() => {
      if(testOutput && stdoutEvents['data'])
        stdoutEvents['data'](Buffer.from(testOutput));
    }, 10);
    setTimeout(() => {
      if(testErrOutput && stderrEvents['data'])
        stderrEvents['data'](Buffer.from(testErrOutput));
    }, 15);
    setTimeout(() => {
      if(events['close'])
        events['close'](closeStatusCode);
    }, 20);

    return {
      on(event: string, callback: (output: Buffer) => void) {
        // @ts-ignore
        events[event] = callback;
      },
      stdout: {
        on(event: string, callback: (output: Buffer) => void) {
          // @ts-ignore
          stdoutEvents[event] = callback;
        }
      },
      stderr: {
        on(event: string, callback: (output: Buffer) => void) {
          // @ts-ignore
          stderrEvents[event] = callback;
        }
      },
    };
  };

}

function FakeExecFile(testOutput = '', testErr) {

  let executed;

  this.getExecuted = function() {
    return executed;
  }

  this.execFile = function(command: string, args: string[], options: {}, callback: (err?: Error, output?: Buffer) => void) {

    executed = `${command} ${args.join(' ')}`

    setTimeout(() => {
      if(testErr)
        callback(testErr);
      else if(testOutput)
        callback(undefined, Buffer.from(testOutput));
    }, 10);
  }

}
