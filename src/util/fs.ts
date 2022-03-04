import nodeFS from 'fs-extra';
import { Docker } from './docker';

export class FS {

  _docker: Docker;
  _fs = nodeFS;
  _useDocker = false;

  constructor(docker: Docker, fs = nodeFS) {
    this._docker = docker;
    this._fs = fs;
  }

  async ensureDir(dirPath: string): Promise<void> {
    if(this._useDocker) {
      return this._fs.ensureDir(dirPath);
    } else {
      return this._fs.ensureDir(dirPath);
    }
  }

  async pathExists(filePath: string): Promise<boolean> {
    if(this._useDocker) {
      return this._fs.pathExists(filePath);
    } else {
      return this._fs.pathExists(filePath);
    }
  }

  async writeFile(filePath: string, data: string, encoding = 'utf8'): Promise<void> {
    if(this._useDocker) {
      return this._fs.writeFile(filePath, data, encoding);
    } else {
      return this._fs.writeFile(filePath, data, encoding);
    }
  }

  async writeJson(filePath: string, data: any, options?: {spaces: number}): Promise<void> {
    if(this._useDocker) {
      return this._fs.writeJson(filePath, data, options);
    } else {
      return this._fs.writeJson(filePath, data, options);
    }
  }

  async readFile(filePath: string, encoding = 'utf8'): Promise<string> {
    if(this._useDocker) {
      return this._fs.readFile(filePath, encoding);
    } else {
      return this._fs.readFile(filePath, encoding);
    }
  }

  async readdir(dirPath: string): Promise<string[]> {
    if(this._useDocker) {
      return this._fs.readdir(dirPath);
    } else {
      return this._fs.readdir(dirPath);
    }
  }

  async remove(filePath: string): Promise<void> {
    if(this._useDocker) {
      return this._fs.remove(filePath);
    } else {
      return this._fs.remove(filePath);
    }
  }

  async copy(srcPath: string, destPath: string, options?: {force: boolean}): Promise<void> {
    if(this._useDocker) {
      return this._fs.copy(srcPath, destPath, options as nodeFS.CopyOptions);
    } else {
      return this._fs.copy(srcPath, destPath, options as nodeFS.CopyOptions);
    }
  }

}
