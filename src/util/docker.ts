import { ChildProcess, execFile, spawn } from 'child_process';
import { Logger } from 'winston';

interface DockerOptions {
  logger?: Logger
}

export class Docker {

  _execFile = execFile;

  _spawn = spawn;

  _logger?: Logger;

  _objectPatt = /({.+})/;

  private _logError(err: Error): void {
    if(this._logger)
      this._logger.error(`${err.message}\n${err.stack || ''}`);
  }

  constructor({ logger }: DockerOptions) {
    if(logger)
      this._logger = logger;
  }

  public async listNetworks():Promise<{Name: string}[]> {
    try {
      let encodedOutput = '';
      await new Promise<void>((resolve, reject) => {
        const instance = spawn('docker', [
          'network',
          'ls',
          `--format='{{json .}}'`,
        ]);
        instance.on('error', err => {
          this._logError(err);
          reject(err);
        });
        instance.on('close', code => {
          resolve();
        });
        instance.stderr.on('data', (data: Buffer) => {
          const str = data.toString();
          reject(new Error(str));
        });
        instance.stdout.on('data', (data: Buffer) => {
          const str = data.toString();
          encodedOutput += str + '\n';
        });
      });
      return encodedOutput
        .trim()
        .split('\n')
        .map(s => s.trim())
        .filter(s => s)
        .map((s): {Name: string} => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(s.slice(1, s.length - 1));
          } catch (err) {
            return {Name: ''};
          }
        })
        .filter(data => data.Name);
    } catch(err) {
      this._logError(err);
      return [];
    }
  }

  public async createNetwork(networkName: string): Promise<boolean> {
      if(!networkName) {
      this._logError(new Error('networkName argument missing in createNetwork call'));
      return false;
    }
    const networks = await this.listNetworks();
    const found = networks.find(n => n.Name === networkName);
    if(found) return true;
    try {
      await new Promise<void>((resolve, reject) => {
        const instance = spawn('docker', [
          'network',
          'create',
          networkName,
        ]);
        instance.on('error', err => {
          reject(err);
        });
        instance.on('close', () => {
          resolve();
        });
        instance.stderr.on('data', (data: Buffer) => {
          const str = data.toString();
          reject(new Error(str));
        });
        // instance.stdout.on('data', data => {
        //   const str = data.toString();
        // });
      });
    } catch(err) {
      this._logError(err);
      return false;
    }
    return true;
  }

  public async containerInspect(name: string): Promise<any> {
    try {
      const output: string = await new Promise((resolve, reject) => {
        this._execFile('docker', ['container', 'inspect', '--format', '"{{json .}}"', name], {}, (err, output) => {
          if (err)
            reject(err);
          else
            resolve(output.toString());
        });
      });
      const matches = output.match(this._objectPatt);
      const jsonStr = matches ? matches[1] : '{}';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(jsonStr);
    } catch (err) {
      this._logError(err);
      return {};
    }
  }

  public async containerStats(name: string): Promise<any> {
    try {
      const output: string = await new Promise((resolve, reject) => {
        this._execFile('docker', ['container', 'stats', '--no-stream', '--no-trunc', '--format', '"{{json .}}"', name], {}, (err, output) => {
          if (err)
            reject(err);
          else
            resolve(output.toString());
        });
      });
      const matches = output.match(this._objectPatt);
      const jsonStr = matches ? matches[1] : '{}';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(jsonStr);
    } catch (err) {
      this._logError(err);
      return {};
    }
  }

  public run(image: string, args: string[], onOutput?: (output: string) => void, onErr?: (err: Error) => void, onClose?: (statusCode: number) => void): ChildProcess {
    const instance = this._spawn('docker', [
      'run',
      ...args,
      ...image
        .split(/\s/g)
        .map(s => s.trim())
        .filter(s => s),
    ]);
    instance.on('error', err => {
      this._logError(err);
      if(onErr)
        onErr(err);
    });
    instance.on('close', code => {
      if(onClose)
        onClose(code || 0);
    });
    instance.stdout.on('data', (data: Buffer) => {
      if(onOutput)
        onOutput(data.toString());
    });
    instance.stderr.on('data', (data: Buffer) => {
      if(onOutput)
        onOutput(data.toString());
    });
    return instance;
  }

  public exec(containerName: string, args: string[], command: string, onOutput: (output: string) => void, onErr: (err: Error) => void, onClose: (statusCode: number) => void): ChildProcess {
    const instance = this._spawn('docker', [
      'exec',
      ...args,
      containerName,
      ...command
        .split(/\s/g)
        .map(s => s.trim())
        .filter(s => s),
    ]);
    instance.on('error', err => {
      this._logError(err);
      if(onErr)
        onErr(err);
    });
    instance.on('close', code => {
      if(onClose)
        onClose(code || 0);
    });
    instance.stdout.on('data', (data: Buffer) => {
      if(onOutput)
        onOutput(data.toString());
    });
    instance.stderr.on('data', (data: Buffer) => {
      if(onOutput)
        onOutput(data.toString());
    });
    return instance;
  }

  public kill(name: string): Promise<string> {
    return new Promise(resolve => {
      execFile('docker', ['kill', name], {}, (err, output) => {
        if(err) {
          this._logError(err);
          resolve('');
        } else {
          const outputStr = output.toString();
          resolve(outputStr);
        }
      });
    });
  }

  public stop(name: string): Promise<string> {
    return new Promise(resolve => {
      execFile('docker', ['stop', name], {}, (err, output) => {
        if(err) {
          this._logError(err);
          resolve('');
        } else {
          const outputStr = output.toString();
          resolve(outputStr);
        }
      });
    });
  }

}
