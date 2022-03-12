import nodeFS from 'fs-extra';
import { Docker } from './docker';
import path from 'path';
import { timeout } from './index';
import { isBoolean } from 'lodash';

export class FS {

  static toBase64(str: string): string {
    const buf = Buffer.from(str, 'utf8');
    return buf.toString('base64');
  }

  _docker: Docker;
  _fs = nodeFS;
  _useDocker = process.env.NL_USE_DOCKER_FS === 'true';

  _dockerFsImage = 'rburgett/docker-fs:0.1.0';

  constructor(docker: Docker, useDocker?: boolean, fs = nodeFS ) {
    this._docker = docker;
    this._fs = fs;
    if(isBoolean(useDocker))
      this._useDocker = useDocker;
  }

  private exec(method: string, targetPath: string, params: any[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const workDir = path.dirname(targetPath);
      const target = path.basename(targetPath);
      let output = '';
      const onOutput = (str: string) => {
        output += str;
      };
      const onError = (err: Error) => {
        reject(err);
      };
      const onClose = () => {
        resolve(output);
      };
      this._docker.run(
        this._dockerFsImage,
        [
          '--rm', '-i',
          '-v', `${workDir}:/workdir`,
          '--env', `DATA=${FS.toBase64(JSON.stringify({method, params: [target, ...params]}))}`,
        ],
        onOutput,
        onError,
        onClose,
      );
    });
  }

  async ensureDir(dirPath: string): Promise<void> {
    if(this._useDocker) {
      await this.exec(
        'ensureDir',
        dirPath,
        [],
      );
    } else {
      return this._fs.ensureDir(dirPath);
    }
  }

  async pathExists(filePath: string): Promise<boolean> {
    if(this._useDocker) {
      const res = await this.exec(
        'pathExists',
        filePath,
        [],
      );
      return JSON.parse(res);
    } else {
      return this._fs.pathExists(filePath);
    }
  }

  async writeFile(filePath: string, content: string, encoding = 'utf8'): Promise<void> {
    if(this._useDocker) {
      return new Promise((resolve, reject) => {
        const workDir = path.dirname(filePath);
        const target = path.basename(filePath);
        let output = '';
        const splitContent = content
          .split('')
          .reduce((arr: string[], char) => {
            const lastIdx = arr.length - 1;
            if(arr[lastIdx] && arr[lastIdx].length < 50000) {
              arr[lastIdx] += char;
            } else {
              arr.push(char);
            }
            return arr;
          }, []);
        let separator = '';
        const onOutput = async (str: string) => {
          const separatorPatt = /\*{2}\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\*{2}/;
          if(separator) {
            output += str;
          } else {
            const matches = str.match(separatorPatt);
            if(matches) {
              separator = matches[0];
              // @ts-ignore
              instance.stdin.write(separator);
              await timeout();
              for(const str of splitContent) {
                // @ts-ignore
                instance.stdin.write(str);
                await timeout();
              }
              // @ts-ignore
              instance.stdin.write(separator);
            }
          }
        };
        const onError = (err: Error) => {
          reject(err);
        };
        const onClose = () => {
          try {
            JSON.parse(output);
          } catch(err) {
            // console.log('problem parsing output');
          }
          resolve();
        };
        const instance = this._docker.run(
          this._dockerFsImage,
          [
            '--rm', '-i',
            '-v', `${workDir}:/workdir`,
            '--env', `DATA=${FS.toBase64(JSON.stringify({method: 'writeFile', params: [target, encoding]}))}`,
          ],
          onOutput,
          onError,
          onClose,
        );
      });
    } else {
      return this._fs.writeFile(filePath, content, encoding);
    }
  }

  async writeJson(filePath: string, data: any, options?: {spaces: number}): Promise<void> {
    if(this._useDocker) {
      const { spaces } = options || {};
      let json: string;
      if(spaces) {
        let spacer = '';
        while(spacer.length < spaces) {
          spacer += ' ';
        }
        json = JSON.stringify(data, null, spacer);
      } else {
        json = JSON.stringify(data);
      }
      return await this.writeFile(filePath, json, 'utf8');
    } else {
      return this._fs.writeJson(filePath, data, options);
    }
  }

  async readFile(filePath: string, encoding = 'utf8'): Promise<string> {
    if(this._useDocker) {
      const res = await this.exec(
        'readFile',
        filePath,
        [encoding],
      );
      return JSON.parse(res);
    } else {
      return this._fs.readFile(filePath, encoding);
    }
  }

  async readJson(filePath: string): Promise<any> {
    if(this._useDocker) {
      const res = await this.readFile(filePath, 'utf8');
      return JSON.parse(res);
    } else {
      return this._fs.readJson(filePath);
    }
  }

  async readdir(dirPath: string): Promise<string[]> {
    if(this._useDocker) {
      const res = await this.exec(
        'readdir',
        dirPath,
        [],
      );
      return JSON.parse(res);
    } else {
      return this._fs.readdir(dirPath);
    }
  }

  async remove(filePath: string): Promise<void> {
    if(this._useDocker) {
      const res = await this.exec(
        'remove',
        filePath,
        [],
      );
      return JSON.parse(res);
    } else {
      return this._fs.remove(filePath);
    }
  }

  async copy(srcPath: string, destPath: string, options?: {force: boolean}): Promise<void> {
    if(this._useDocker) {
      const content = await this.readFile(srcPath,'utf8');
      const { force = false } = options || {};
      if(force) {
        await this.writeFile(destPath, content, 'utf8');
      } else {
        const exists = await this.pathExists(destPath);
        if(!exists)
          await this.writeFile(destPath, content, 'utf8');
      }
    } else {
      return this._fs.copy(srcPath, destPath, options as nodeFS.CopyOptions);
    }
  }

}
