/* eslint-disable */

import 'should';
import { Bitcoin } from './bitcoin';
import { NetworkType, NodeClient, NodeType } from '../../constants';

describe('Bitcoin', function() {
  it('should be a constructor', function() {
    Bitcoin.should.be.a.constructor();
  });
  describe('static Bitcoin.nodeTypes', function() {
    it('should be an array of node type strings', function() {
      Bitcoin.nodeTypes.should.be.an.Array();
      Bitcoin.nodeTypes.length.should.be.greaterThan(0);
      Bitcoin.nodeTypes.every(t => NodeType[t]).should.be.True();
    });
  });
  describe('static Bitcoin.networkTypes', function() {
    it('should be an array of network type strings', function() {
      Bitcoin.networkTypes.should.be.an.Array();
      Bitcoin.networkTypes.length.should.be.greaterThan(0);
      Bitcoin.networkTypes.every(t => NetworkType[t]).should.be.True();
    });
  });
  describe('static Bitcoin.defaultRPCPort', function() {
    it('should be an object mapping network type to port number', function() {
      Bitcoin.defaultRPCPort.should.be.an.Object();
      const keys = Object.keys(Bitcoin.defaultRPCPort);
      keys.length.should.be.greaterThan(0);
      keys.length.should.equal(Bitcoin.networkTypes.length);
      // @ts-ignore
      keys.every(k => NetworkType[k]).should.be.True();
      Object.values(Bitcoin.defaultRPCPort).every(v => v.should.be.a.Number());
    });
  });
  describe('static Bitcoin.defaultPeerPort', function() {
    it('should be an object mapping network type to port number', function() {
      Bitcoin.defaultPeerPort.should.be.an.Object();
      const keys = Object.keys(Bitcoin.defaultPeerPort);
      keys.length.should.be.greaterThan(0);
      keys.length.should.equal(Bitcoin.networkTypes.length);
      // @ts-ignore
      keys.every(k => NetworkType[k]).should.be.True();
      Object.values(Bitcoin.defaultPeerPort).every(v => v.should.be.a.Number());
    });
  });
  describe('static Bitcoin.defaultCPUs', function() {
    it('should be the default CPU number', function() {
      Bitcoin.defaultCPUs.should.be.a.Number();
      Bitcoin.defaultCPUs.should.be.greaterThan(0);
    });
  });
  describe('static Bitcoin.defaultMem', function() {
    it('should be the default memory size', function() {
      Bitcoin.defaultMem.should.be.a.Number();
      Bitcoin.defaultMem.should.be.greaterThan(0);
    });
  });
  describe('static Bitcoin.generateConfig()', function() {
    it('should generate a default config file', function() {
      const config = Bitcoin.generateConfig();
      config.should.be.a.String();
      config.length.should.be.greaterThan(0);
    });
  });
});
