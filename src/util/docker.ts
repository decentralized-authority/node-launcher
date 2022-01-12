import { ChildProcess, execFile, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { DockerEvent } from '../constants';

export class Docker extends EventEmitter {

  _execFile = execFile;

  _spawn = spawn;

  _objectPatt = /({.+})/;

  _logDriver = '';

  private _logError(err: Error): void {
    this.emit(DockerEvent.ERROR, err);
  }

  private _logInfo(str: string): void {
    this.emit(DockerEvent.INFO, str);
  }

  constructor(dockerParams = {logDriver: ''}) {
    super();
    this._logDriver = dockerParams.logDriver;
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
        const command = 'docker';
        const args = [
          'network',
          'create',
          networkName,
        ];
        this.emit(DockerEvent.INFO, `${command} ${args.join(' ')}`);
        const instance = spawn(command, args);
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

  async containerExists(name: string): Promise<boolean> {
    try {
      const data = await this.containerInspect(name);
      return Object.keys(data).length > 0;
    } catch(err) {
      return false;
    }
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
    const command = 'docker';
    if(this._logDriver) {
      args = [
        '--log-driver',
        'none',
        ...args,
      ];
    }
    const spawnArgs = [
      'run',
      ...args,
      ...image
        .split(/\s/g)
        .map(s => s.trim())
        .filter(s => s),
    ];
    this.emit(DockerEvent.INFO, `${command} ${spawnArgs.join(' ')}`);
    const instance = this._spawn(command, spawnArgs);
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
    const spawnCommand = 'docker';
    const spawnArgs = [
      'exec',
      ...args,
      containerName,
      ...command
        .split(/\s/g)
        .map(s => s.trim())
        .filter(s => s),
    ];
    this.emit(DockerEvent.INFO, `${spawnCommand} ${spawnArgs.join(' ')}`);
    const instance = this._spawn(spawnCommand, spawnArgs);
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
      const command = 'docker';
      const args = ['kill', name];
      this.emit(DockerEvent.INFO, `${command} ${args.join(' ')}`);
      execFile(command, args, {}, (err, output) => {
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
      const command = 'docker';
      const args = ['stop', name];
      this.emit(DockerEvent.INFO, `${command} ${args.join(' ')}`);
      execFile(command, args, {}, (err, output) => {
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

  pull(image: string, onOutput?: (output: string)=>void): Promise<number> {
    return new Promise((resolve, reject) => {
      const instance = spawn('docker', ['pull', image]);
      instance.stdout.on('data', data => {
        const str = data.toString();
        if(onOutput)
          onOutput(str);
      });
      instance.stderr.on('data', data => {
        const str = data.toString();
        if(onOutput)
          onOutput(str);
      });
      instance.on('error', err => {
        reject(err);
      });
      instance.on('close', code => {
        resolve(code || 0);
      });
    });
  }

  public rm(name: string): Promise<boolean> {
    return new Promise(resolve => {
      const command = 'docker';
      const args = ['rm', name];
      this.emit(DockerEvent.INFO, `${command} ${args.join(' ')}`);
      execFile(command, args, {}, err => {
        if(err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

}
