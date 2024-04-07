const fixPathImportESM = require('node:url').pathToFileURL(__filename)
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/universalify/index.js"(exports) {
    "use strict";
    exports.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function")
          fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            fn.call(
              this,
              ...args,
              (err, res) => err != null ? reject(err) : resolve(res)
            );
          });
        }
      }, "name", { value: fn.name });
    };
    exports.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function")
          return fn.apply(this, args);
        else
          fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform3 = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs9) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs9);
      }
      if (!fs9.lutimes) {
        patchLutimes(fs9);
      }
      fs9.chown = chownFix(fs9.chown);
      fs9.fchown = chownFix(fs9.fchown);
      fs9.lchown = chownFix(fs9.lchown);
      fs9.chmod = chmodFix(fs9.chmod);
      fs9.fchmod = chmodFix(fs9.fchmod);
      fs9.lchmod = chmodFix(fs9.lchmod);
      fs9.chownSync = chownFixSync(fs9.chownSync);
      fs9.fchownSync = chownFixSync(fs9.fchownSync);
      fs9.lchownSync = chownFixSync(fs9.lchownSync);
      fs9.chmodSync = chmodFixSync(fs9.chmodSync);
      fs9.fchmodSync = chmodFixSync(fs9.fchmodSync);
      fs9.lchmodSync = chmodFixSync(fs9.lchmodSync);
      fs9.stat = statFix(fs9.stat);
      fs9.fstat = statFix(fs9.fstat);
      fs9.lstat = statFix(fs9.lstat);
      fs9.statSync = statFixSync(fs9.statSync);
      fs9.fstatSync = statFixSync(fs9.fstatSync);
      fs9.lstatSync = statFixSync(fs9.lstatSync);
      if (fs9.chmod && !fs9.lchmod) {
        fs9.lchmod = function(path5, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs9.lchmodSync = function() {
        };
      }
      if (fs9.chown && !fs9.lchown) {
        fs9.lchown = function(path5, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs9.lchownSync = function() {
        };
      }
      if (platform3 === "win32") {
        fs9.rename = typeof fs9.rename !== "function" ? fs9.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start3 = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start3 < 6e4) {
                setTimeout(function() {
                  fs9.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          }
          if (Object.setPrototypeOf)
            Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs9.rename);
      }
      fs9.read = typeof fs9.read !== "function" ? fs9.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs9, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs9, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs9.read);
      fs9.readSync = typeof fs9.readSync !== "function" ? fs9.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs9, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs9.readSync);
      function patchLchmod(fs10) {
        fs10.lchmod = function(path5, mode, callback) {
          fs10.open(
            path5,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback)
                  callback(err);
                return;
              }
              fs10.fchmod(fd, mode, function(err2) {
                fs10.close(fd, function(err22) {
                  if (callback)
                    callback(err2 || err22);
                });
              });
            }
          );
        };
        fs10.lchmodSync = function(path5, mode) {
          var fd = fs10.openSync(path5, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs10.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs10.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs10.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs10) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs10.futimes) {
          fs10.lutimes = function(path5, at, mt, cb) {
            fs10.open(path5, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs10.futimes(fd, at, mt, function(er2) {
                fs10.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs10.lutimesSync = function(path5, at, mt) {
            var fd = fs10.openSync(path5, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs10.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs10.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs10.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs10.futimes) {
          fs10.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs10.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs9, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs9, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs9, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs9, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs9, target, options, callback) : orig.call(fs9, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs9, target, options) : orig.call(fs9, target);
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs9) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path5, options) {
        if (!(this instanceof ReadStream))
          return new ReadStream(path5, options);
        Stream.call(this);
        var self = this;
        this.path = path5;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self._read();
          });
          return;
        }
        fs9.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self.emit("error", err);
            self.readable = false;
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self._read();
        });
      }
      function WriteStream(path5, options) {
        if (!(this instanceof WriteStream))
          return new WriteStream(path5, options);
        Stream.call(this);
        this.path = path5;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs9.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports, module2) {
    var fs9 = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs9[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs9, queue);
      fs9.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs9, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs9.close);
      fs9.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs9, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs9.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs9[gracefulQueue]);
          require("assert").equal(fs9[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs9[gracefulQueue]);
    }
    module2.exports = patch(clone(fs9));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs9.__patched) {
      module2.exports = patch(fs9);
      fs9.__patched = true;
    }
    function patch(fs10) {
      polyfills(fs10);
      fs10.gracefulify = patch;
      fs10.createReadStream = createReadStream;
      fs10.createWriteStream = createWriteStream;
      var fs$readFile = fs10.readFile;
      fs10.readFile = readFile;
      function readFile(path5, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path5, options, cb);
        function go$readFile(path6, options2, cb2, startTime) {
          return fs$readFile(path6, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path6, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs10.writeFile;
      fs10.writeFile = writeFile;
      function writeFile(path5, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path5, data, options, cb);
        function go$writeFile(path6, data2, options2, cb2, startTime) {
          return fs$writeFile(path6, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path6, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs10.appendFile;
      if (fs$appendFile)
        fs10.appendFile = appendFile;
      function appendFile(path5, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path5, data, options, cb);
        function go$appendFile(path6, data2, options2, cb2, startTime) {
          return fs$appendFile(path6, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path6, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs10.copyFile;
      if (fs$copyFile)
        fs10.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs10.readdir;
      fs10.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path5, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path6, options2, cb2, startTime) {
          return fs$readdir(path6, fs$readdirCallback(
            path6,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path6, options2, cb2, startTime) {
          return fs$readdir(path6, options2, fs$readdirCallback(
            path6,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path5, options, cb);
        function fs$readdirCallback(path6, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path6, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs10);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs10.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs10.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs10, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs10, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs10, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs10, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path5, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open2(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path5, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open2(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path5, options) {
        return new fs10.ReadStream(path5, options);
      }
      function createWriteStream(path5, options) {
        return new fs10.WriteStream(path5, options);
      }
      var fs$open = fs10.open;
      fs10.open = open2;
      function open2(path5, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path5, flags, mode, cb);
        function go$open(path6, flags2, mode2, cb2, startTime) {
          return fs$open(path6, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path6, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs10;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs9[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs9[gracefulQueue].length; ++i) {
        if (fs9[gracefulQueue][i].length > 2) {
          fs9[gracefulQueue][i][3] = now;
          fs9[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs9[gracefulQueue].length === 0)
        return;
      var elem = fs9[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs9[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs9 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs9[key] === "function";
    });
    Object.assign(exports, fs9);
    api.forEach((method) => {
      exports[method] = u(fs9[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs9.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs9.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs9.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs9.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs9.realpath.native === "function") {
      exports.realpath.native = u(fs9.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module2) {
    "use strict";
    var path5 = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path5.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module2) {
    "use strict";
    var fs9 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number")
        return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs9.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs9.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/fs-extra/lib/path-exists/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    function pathExists(path5) {
      return fs9.access(path5).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs9.existsSync
    };
  }
});

// node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/fs-extra/lib/util/utimes.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    function utimesMillis(path5, atime, mtime, callback) {
      fs9.open(path5, "r+", (err, fd) => {
        if (err)
          return callback(err);
        fs9.futimes(fd, atime, mtime, (futimesErr) => {
          fs9.close(fd, (closeErr) => {
            if (callback)
              callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path5, atime, mtime) {
      const fd = fs9.openSync(path5, "r+");
      fs9.futimesSync(fd, atime, mtime);
      return fs9.closeSync(fd);
    }
    module2.exports = {
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/fs-extra/lib/util/stat.js"(exports, module2) {
    "use strict";
    var fs9 = require_fs();
    var path5 = require("path");
    var util = require("util");
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs9.stat(file, { bigint: true }) : (file) => fs9.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT")
            return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs9.statSync(file, { bigint: true }) : (file) => fs9.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT")
          return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest, funcName, opts, cb) {
      util.callbackify(getStats)(src, dest, opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat) {
          if (areIdentical(srcStat, destStat)) {
            const srcBaseName = path5.basename(src);
            const destBaseName = path5.basename(dest);
            if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
              return cb(null, { srcStat, destStat, isChangingCase: true });
            }
            return cb(new Error("Source and destination must not be the same."));
          }
          if (srcStat.isDirectory() && !destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
          }
          if (!srcStat.isDirectory() && destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
          }
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, { srcStat, destStat });
      });
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path5.basename(src);
          const destBaseName = path5.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkParentPaths(src, srcStat, dest, funcName, cb) {
      const srcParent = path5.resolve(path5.dirname(src));
      const destParent = path5.resolve(path5.dirname(dest));
      if (destParent === srcParent || destParent === path5.parse(destParent).root)
        return cb();
      fs9.stat(destParent, { bigint: true }, (err, destStat) => {
        if (err) {
          if (err.code === "ENOENT")
            return cb();
          return cb(err);
        }
        if (areIdentical(srcStat, destStat)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return checkParentPaths(src, srcStat, destParent, funcName, cb);
      });
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path5.resolve(path5.dirname(src));
      const destParent = path5.resolve(path5.dirname(dest));
      if (destParent === srcParent || destParent === path5.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = fs9.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path5.resolve(src).split(path5.sep).filter((i) => i);
      const destArr = path5.resolve(dest).split(path5.sep).filter((i) => i);
      return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      checkPaths,
      checkPathsSync,
      checkParentPaths,
      checkParentPathsSync,
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/fs-extra/lib/copy/copy.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path5 = require("path");
    var mkdirs = require_mkdirs().mkdirs;
    var pathExists = require_path_exists().pathExists;
    var utimesMillis = require_utimes().utimesMillis;
    var stat = require_stat();
    function copy(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      stat.checkPaths(src, dest, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        stat.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
          if (err2)
            return cb(err2);
          runFilter(src, dest, opts, (err3, include) => {
            if (err3)
              return cb(err3);
            if (!include)
              return cb();
            checkParentDir(destStat, src, dest, opts, cb);
          });
        });
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path5.dirname(dest);
      pathExists(destParent, (err, dirExists) => {
        if (err)
          return cb(err);
        if (dirExists)
          return getStats(destStat, src, dest, opts, cb);
        mkdirs(destParent, (err2) => {
          if (err2)
            return cb(err2);
          return getStats(destStat, src, dest, opts, cb);
        });
      });
    }
    function runFilter(src, dest, opts, cb) {
      if (!opts.filter)
        return cb(null, true);
      Promise.resolve(opts.filter(src, dest)).then((include) => cb(null, include), (error) => cb(error));
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat2 = opts.dereference ? fs9.stat : fs9.lstat;
      stat2(src, (err, srcStat) => {
        if (err)
          return cb(err);
        if (srcStat.isDirectory())
          return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
          return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink())
          return onLink(destStat, src, dest, opts, cb);
        else if (srcStat.isSocket())
          return cb(new Error(`Cannot copy a socket file: ${src}`));
        else if (srcStat.isFIFO())
          return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
        return cb(new Error(`Unknown file: ${src}`));
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs9.unlink(dest, (err) => {
          if (err)
            return cb(err);
          return copyFile(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else
        return cb();
    }
    function copyFile(srcStat, src, dest, opts, cb) {
      fs9.copyFile(src, dest, (err) => {
        if (err)
          return cb(err);
        if (opts.preserveTimestamps)
          return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return setDestMode(dest, srcStat.mode, cb);
      });
    }
    function handleTimestampsAndMode(srcMode, src, dest, cb) {
      if (fileIsNotWritable(srcMode)) {
        return makeFileWritable(dest, srcMode, (err) => {
          if (err)
            return cb(err);
          return setDestTimestampsAndMode(srcMode, src, dest, cb);
        });
      }
      return setDestTimestampsAndMode(srcMode, src, dest, cb);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode, cb) {
      return setDestMode(dest, srcMode | 128, cb);
    }
    function setDestTimestampsAndMode(srcMode, src, dest, cb) {
      setDestTimestamps(src, dest, (err) => {
        if (err)
          return cb(err);
        return setDestMode(dest, srcMode, cb);
      });
    }
    function setDestMode(dest, srcMode, cb) {
      return fs9.chmod(dest, srcMode, cb);
    }
    function setDestTimestamps(src, dest, cb) {
      fs9.stat(src, (err, updatedSrcStat) => {
        if (err)
          return cb(err);
        return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcMode, src, dest, opts, cb) {
      fs9.mkdir(dest, (err) => {
        if (err)
          return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2)
            return cb(err2);
          return setDestMode(dest, srcMode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs9.readdir(src, (err, items) => {
        if (err)
          return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item = items.pop();
      if (!item)
        return cb();
      return copyDirItem(items, item, src, dest, opts, cb);
    }
    function copyDirItem(items, item, src, dest, opts, cb) {
      const srcItem = path5.join(src, item);
      const destItem = path5.join(dest, item);
      runFilter(srcItem, destItem, opts, (err, include) => {
        if (err)
          return cb(err);
        if (!include)
          return copyDirItems(items, src, dest, opts, cb);
        stat.checkPaths(srcItem, destItem, "copy", opts, (err2, stats) => {
          if (err2)
            return cb(err2);
          const { destStat } = stats;
          getStats(destStat, srcItem, destItem, opts, (err3) => {
            if (err3)
              return cb(err3);
            return copyDirItems(items, src, dest, opts, cb);
          });
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs9.readlink(src, (err, resolvedSrc) => {
        if (err)
          return cb(err);
        if (opts.dereference) {
          resolvedSrc = path5.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
          return fs9.symlink(resolvedSrc, dest, cb);
        } else {
          fs9.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
                return fs9.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path5.resolve(process.cwd(), resolvedDest);
            }
            if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs9.unlink(dest, (err) => {
        if (err)
          return cb(err);
        return fs9.symlink(resolvedSrc, dest, cb);
      });
    }
    module2.exports = copy;
  }
});

// node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path5 = require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts.filter && !opts.filter(src, dest))
        return;
      const destParent = path5.dirname(dest);
      if (!fs9.existsSync(destParent))
        mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs9.statSync : fs9.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs9.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs9.copyFileSync(src, dest);
      if (opts.preserveTimestamps)
        handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode))
        makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs9.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs9.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs9.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      fs9.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path5.join(src, item);
      const destItem = path5.join(dest, item);
      if (opts.filter && !opts.filter(srcItem, destItem))
        return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
      return getStats(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs9.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path5.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs9.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN")
            return fs9.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path5.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs9.unlinkSync(dest);
      return fs9.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/fs-extra/lib/copy/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/fs-extra/lib/remove/index.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path5, callback) {
      fs9.rm(path5, { recursive: true, force: true }, callback);
    }
    function removeSync(path5) {
      fs9.rmSync(path5, { recursive: true, force: true });
    }
    module2.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/fs-extra/lib/empty/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    var path5 = require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs9.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path5.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs9.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path5.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/fs-extra/lib/ensure/file.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path5 = require("path");
    var fs9 = require_graceful_fs();
    var mkdir = require_mkdirs();
    function createFile(file, callback) {
      function makeFile() {
        fs9.writeFile(file, "", (err) => {
          if (err)
            return callback(err);
          callback();
        });
      }
      fs9.stat(file, (err, stats) => {
        if (!err && stats.isFile())
          return callback();
        const dir = path5.dirname(file);
        fs9.stat(dir, (err2, stats2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return mkdir.mkdirs(dir, (err3) => {
                if (err3)
                  return callback(err3);
                makeFile();
              });
            }
            return callback(err2);
          }
          if (stats2.isDirectory())
            makeFile();
          else {
            fs9.readdir(dir, (err3) => {
              if (err3)
                return callback(err3);
            });
          }
        });
      });
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs9.statSync(file);
      } catch {
      }
      if (stats && stats.isFile())
        return;
      const dir = path5.dirname(file);
      try {
        if (!fs9.statSync(dir).isDirectory()) {
          fs9.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT")
          mkdir.mkdirsSync(dir);
        else
          throw err;
      }
      fs9.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/fs-extra/lib/ensure/link.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path5 = require("path");
    var fs9 = require_graceful_fs();
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createLink(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs9.link(srcpath2, dstpath2, (err) => {
          if (err)
            return callback(err);
          callback(null);
        });
      }
      fs9.lstat(dstpath, (_, dstStat) => {
        fs9.lstat(srcpath, (err, srcStat) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureLink");
            return callback(err);
          }
          if (dstStat && areIdentical(srcStat, dstStat))
            return callback(null);
          const dir = path5.dirname(dstpath);
          pathExists(dir, (err2, dirExists) => {
            if (err2)
              return callback(err2);
            if (dirExists)
              return makeLink(srcpath, dstpath);
            mkdir.mkdirs(dir, (err3) => {
              if (err3)
                return callback(err3);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs9.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs9.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat))
          return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path5.dirname(dstpath);
      const dirExists = fs9.existsSync(dir);
      if (dirExists)
        return fs9.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs9.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module2) {
    "use strict";
    var path5 = require("path");
    var fs9 = require_graceful_fs();
    var pathExists = require_path_exists().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path5.isAbsolute(srcpath)) {
        return fs9.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: srcpath
          });
        });
      } else {
        const dstdir = path5.dirname(dstpath);
        const relativeToDst = path5.join(dstdir, srcpath);
        return pathExists(relativeToDst, (err, exists) => {
          if (err)
            return callback(err);
          if (exists) {
            return callback(null, {
              toCwd: relativeToDst,
              toDst: srcpath
            });
          } else {
            return fs9.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                toCwd: srcpath,
                toDst: path5.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists;
      if (path5.isAbsolute(srcpath)) {
        exists = fs9.existsSync(srcpath);
        if (!exists)
          throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      } else {
        const dstdir = path5.dirname(dstpath);
        const relativeToDst = path5.join(dstdir, srcpath);
        exists = fs9.existsSync(relativeToDst);
        if (exists) {
          return {
            toCwd: relativeToDst,
            toDst: srcpath
          };
        } else {
          exists = fs9.existsSync(srcpath);
          if (!exists)
            throw new Error("relative srcpath does not exist");
          return {
            toCwd: srcpath,
            toDst: path5.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type)
        return callback(null, type);
      fs9.lstat(srcpath, (err, stats) => {
        if (err)
          return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type)
        return type;
      try {
        stats = fs9.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path5 = require("path");
    var fs9 = require_fs();
    var _mkdirs = require_mkdirs();
    var mkdirs = _mkdirs.mkdirs;
    var mkdirsSync = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createSymlink(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      fs9.lstat(dstpath, (err, stats) => {
        if (!err && stats.isSymbolicLink()) {
          Promise.all([
            fs9.stat(srcpath),
            fs9.stat(dstpath)
          ]).then(([srcStat, dstStat]) => {
            if (areIdentical(srcStat, dstStat))
              return callback(null);
            _createSymlink(srcpath, dstpath, type, callback);
          });
        } else
          _createSymlink(srcpath, dstpath, type, callback);
      });
    }
    function _createSymlink(srcpath, dstpath, type, callback) {
      symlinkPaths(srcpath, dstpath, (err, relative) => {
        if (err)
          return callback(err);
        srcpath = relative.toDst;
        symlinkType(relative.toCwd, type, (err2, type2) => {
          if (err2)
            return callback(err2);
          const dir = path5.dirname(dstpath);
          pathExists(dir, (err3, dirExists) => {
            if (err3)
              return callback(err3);
            if (dirExists)
              return fs9.symlink(srcpath, dstpath, type2, callback);
            mkdirs(dir, (err4) => {
              if (err4)
                return callback(err4);
              fs9.symlink(srcpath, dstpath, type2, callback);
            });
          });
        });
      });
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs9.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs9.statSync(srcpath);
        const dstStat = fs9.statSync(dstpath);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path5.dirname(dstpath);
      const exists = fs9.existsSync(dir);
      if (exists)
        return fs9.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs9.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/fs-extra/lib/ensure/index.js"(exports, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module2.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/jsonfile/utils.js"(exports, module2) {
    function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content))
        content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify, stripBom };
  }
});

// node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/jsonfile/index.js"(exports, module2) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs9 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs9.readFile)(file, options);
      data = stripBom(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile = universalify.fromPromise(_readFile);
    function readFileSync3(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs9 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs9.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs9 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs9.writeFile)(file, str, options);
    }
    var writeFile = universalify.fromPromise(_writeFile);
    function writeFileSync2(file, obj, options = {}) {
      const fs9 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs9.writeFileSync(file, str, options);
    }
    var jsonfile = {
      readFile,
      readFileSync: readFileSync3,
      writeFile,
      writeFileSync: writeFileSync2
    };
    module2.exports = jsonfile;
  }
});

// node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/fs-extra/lib/json/jsonfile.js"(exports, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "node_modules/fs-extra/lib/output-file/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs9 = require_graceful_fs();
    var path5 = require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    function outputFile(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path5.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err)
          return callback(err);
        if (itDoes)
          return fs9.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2)
            return callback(err2);
          fs9.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync(file, ...args) {
      const dir = path5.dirname(file);
      if (fs9.existsSync(dir)) {
        return fs9.writeFileSync(file, ...args);
      }
      mkdir.mkdirsSync(dir);
      fs9.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/fs-extra/lib/json/output-json.js"(exports, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/fs-extra/lib/json/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/fs-extra/lib/move/move.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path5 = require("path");
    var copy = require_copy2().copy;
    var remove = require_remove().remove;
    var mkdirp = require_mkdirs().mkdirp;
    var pathExists = require_path_exists().pathExists;
    var stat = require_stat();
    function move(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      stat.checkPaths(src, dest, "move", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, isChangingCase = false } = stats;
        stat.checkParentPaths(src, srcStat, dest, "move", (err2) => {
          if (err2)
            return cb(err2);
          if (isParentRoot(dest))
            return doRename(src, dest, overwrite, isChangingCase, cb);
          mkdirp(path5.dirname(dest), (err3) => {
            if (err3)
              return cb(err3);
            return doRename(src, dest, overwrite, isChangingCase, cb);
          });
        });
      });
    }
    function isParentRoot(dest) {
      const parent = path5.dirname(dest);
      const parsedPath = path5.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase, cb) {
      if (isChangingCase)
        return rename(src, dest, overwrite, cb);
      if (overwrite) {
        return remove(dest, (err) => {
          if (err)
            return cb(err);
          return rename(src, dest, overwrite, cb);
        });
      }
      pathExists(dest, (err, destExists) => {
        if (err)
          return cb(err);
        if (destExists)
          return cb(new Error("dest already exists."));
        return rename(src, dest, overwrite, cb);
      });
    }
    function rename(src, dest, overwrite, cb) {
      fs9.rename(src, dest, (err) => {
        if (!err)
          return cb();
        if (err.code !== "EXDEV")
          return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copy(src, dest, opts, (err) => {
        if (err)
          return cb(err);
        return remove(src, cb);
      });
    }
    module2.exports = move;
  }
});

// node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/fs-extra/lib/move/move-sync.js"(exports, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path5 = require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest))
        mkdirpSync(path5.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path5.dirname(dest);
      const parsedPath = path5.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase)
        return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs9.existsSync(dest))
        throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs9.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV")
          throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/fs-extra/lib/move/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/fs-extra/lib/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      // Export promiseified graceful-fs:
      ...require_fs(),
      // Export extra methods:
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// node_modules/yt-dlp-wrap/dist/index.js
var require_dist = __commonJS({
  "node_modules/yt-dlp-wrap/dist/index.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var events_1 = require("events");
    var child_process_1 = require("child_process");
    var fs_1 = __importDefault(require("fs"));
    var https_1 = __importDefault(require("https"));
    var os_1 = __importDefault(require("os"));
    var stream_1 = require("stream");
    var executableName = "yt-dlp";
    var progressRegex = /\[download\] *(.*) of ([^ ]*)(:? *at *([^ ]*))?(:? *ETA *([^ ]*))?/;
    var YTDlpWrap2 = (
      /** @class */
      function() {
        function YTDlpWrap3(binaryPath) {
          if (binaryPath === void 0) {
            binaryPath = executableName;
          }
          this.binaryPath = binaryPath;
        }
        YTDlpWrap3.prototype.getBinaryPath = function() {
          return this.binaryPath;
        };
        YTDlpWrap3.prototype.setBinaryPath = function(binaryPath) {
          this.binaryPath = binaryPath;
        };
        YTDlpWrap3.createGetMessage = function(url) {
          return new Promise(function(resolve, reject) {
            https_1.default.get(url, function(httpResponse) {
              httpResponse.on("error", function(e) {
                return reject(e);
              });
              resolve(httpResponse);
            });
          });
        };
        YTDlpWrap3.processMessageToFile = function(message, filePath) {
          var file = fs_1.default.createWriteStream(filePath);
          return new Promise(function(resolve, reject) {
            message.pipe(file);
            message.on("error", function(e) {
              return reject(e);
            });
            file.on("finish", function() {
              return message.statusCode == 200 ? resolve(message) : reject(message);
            });
          });
        };
        YTDlpWrap3.downloadFile = function(fileURL, filePath) {
          return __awaiter(this, void 0, void 0, function() {
            var currentUrl, message;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  currentUrl = fileURL;
                  _a.label = 1;
                case 1:
                  if (!currentUrl)
                    return [3, 6];
                  return [4, YTDlpWrap3.createGetMessage(currentUrl)];
                case 2:
                  message = _a.sent();
                  if (!message.headers.location)
                    return [3, 3];
                  currentUrl = message.headers.location;
                  return [3, 5];
                case 3:
                  return [4, YTDlpWrap3.processMessageToFile(message, filePath)];
                case 4:
                  return [2, _a.sent()];
                case 5:
                  return [3, 1];
                case 6:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YTDlpWrap3.getGithubReleases = function(page, perPage) {
          if (page === void 0) {
            page = 1;
          }
          if (perPage === void 0) {
            perPage = 1;
          }
          return new Promise(function(resolve, reject) {
            var apiURL = "https://api.github.com/repos/yt-dlp/yt-dlp/releases?page=" + page + "&per_page=" + perPage;
            https_1.default.get(apiURL, { headers: { "User-Agent": "node" } }, function(response) {
              var resonseString = "";
              response.setEncoding("utf8");
              response.on("data", function(body) {
                return resonseString += body;
              });
              response.on("error", function(e) {
                return reject(e);
              });
              response.on("end", function() {
                return response.statusCode == 200 ? resolve(JSON.parse(resonseString)) : reject(response);
              });
            });
          });
        };
        YTDlpWrap3.downloadFromGithub = function(filePath, version, platform3) {
          if (platform3 === void 0) {
            platform3 = os_1.default.platform();
          }
          return __awaiter(this, void 0, void 0, function() {
            var isWin32, fileName, fileURL;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  isWin32 = platform3 == "win32";
                  fileName = "".concat(executableName).concat(isWin32 ? ".exe" : "");
                  if (!!version)
                    return [3, 2];
                  return [4, YTDlpWrap3.getGithubReleases(1, 1)];
                case 1:
                  version = _a.sent()[0].tag_name;
                  _a.label = 2;
                case 2:
                  if (!filePath)
                    filePath = "./" + fileName;
                  fileURL = "https://github.com/yt-dlp/yt-dlp/releases/download/" + version + "/" + fileName;
                  return [4, YTDlpWrap3.downloadFile(fileURL, filePath)];
                case 3:
                  _a.sent();
                  !isWin32 && fs_1.default.chmodSync(filePath, "777");
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YTDlpWrap3.prototype.exec = function(ytDlpArguments, options, abortSignal) {
          if (ytDlpArguments === void 0) {
            ytDlpArguments = [];
          }
          if (options === void 0) {
            options = {};
          }
          if (abortSignal === void 0) {
            abortSignal = null;
          }
          options = YTDlpWrap3.setDefaultOptions(options);
          var execEventEmitter = new events_1.EventEmitter();
          var ytDlpProcess = (0, child_process_1.spawn)(this.binaryPath, ytDlpArguments, options);
          execEventEmitter.ytDlpProcess = ytDlpProcess;
          YTDlpWrap3.bindAbortSignal(abortSignal, ytDlpProcess);
          var stderrData = "";
          var processError;
          ytDlpProcess.stdout.on("data", function(data) {
            return YTDlpWrap3.emitYoutubeDlEvents(data.toString(), execEventEmitter);
          });
          ytDlpProcess.stderr.on("data", function(data) {
            return stderrData += data.toString();
          });
          ytDlpProcess.on("error", function(error) {
            return processError = error;
          });
          ytDlpProcess.on("close", function(code) {
            if (code === 0 || ytDlpProcess.killed)
              execEventEmitter.emit("close", code);
            else
              execEventEmitter.emit("error", YTDlpWrap3.createError(code, processError, stderrData));
          });
          return execEventEmitter;
        };
        YTDlpWrap3.prototype.execPromise = function(ytDlpArguments, options, abortSignal) {
          var _this = this;
          if (ytDlpArguments === void 0) {
            ytDlpArguments = [];
          }
          if (options === void 0) {
            options = {};
          }
          if (abortSignal === void 0) {
            abortSignal = null;
          }
          var ytDlpProcess;
          var ytDlpPromise = new Promise(function(resolve, reject) {
            options = YTDlpWrap3.setDefaultOptions(options);
            ytDlpProcess = (0, child_process_1.execFile)(_this.binaryPath, ytDlpArguments, options, function(error, stdout, stderr) {
              if (error)
                reject(YTDlpWrap3.createError(error, null, stderr));
              resolve(stdout);
            });
            YTDlpWrap3.bindAbortSignal(abortSignal, ytDlpProcess);
          });
          ytDlpPromise.ytDlpProcess = ytDlpProcess;
          return ytDlpPromise;
        };
        YTDlpWrap3.prototype.execStream = function(ytDlpArguments, options, abortSignal) {
          if (ytDlpArguments === void 0) {
            ytDlpArguments = [];
          }
          if (options === void 0) {
            options = {};
          }
          if (abortSignal === void 0) {
            abortSignal = null;
          }
          var readStream = new stream_1.Readable({ read: function(size) {
          } });
          options = YTDlpWrap3.setDefaultOptions(options);
          ytDlpArguments = ytDlpArguments.concat(["-o", "-"]);
          var ytDlpProcess = (0, child_process_1.spawn)(this.binaryPath, ytDlpArguments, options);
          readStream.ytDlpProcess = ytDlpProcess;
          YTDlpWrap3.bindAbortSignal(abortSignal, ytDlpProcess);
          var stderrData = "";
          var processError;
          ytDlpProcess.stdout.on("data", function(data) {
            return readStream.push(data);
          });
          ytDlpProcess.stderr.on("data", function(data) {
            var stringData = data.toString();
            YTDlpWrap3.emitYoutubeDlEvents(stringData, readStream);
            stderrData += stringData;
          });
          ytDlpProcess.on("error", function(error) {
            return processError = error;
          });
          ytDlpProcess.on("close", function(code) {
            if (code === 0 || ytDlpProcess.killed) {
              readStream.emit("close");
              readStream.destroy();
              readStream.emit("end");
            } else {
              var error = YTDlpWrap3.createError(code, processError, stderrData);
              readStream.emit("error", error);
              readStream.destroy(error);
            }
          });
          return readStream;
        };
        YTDlpWrap3.prototype.getExtractors = function() {
          return __awaiter(this, void 0, void 0, function() {
            var ytDlpStdout;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.execPromise(["--list-extractors"])];
                case 1:
                  ytDlpStdout = _a.sent();
                  return [2, ytDlpStdout.split("\n")];
              }
            });
          });
        };
        YTDlpWrap3.prototype.getExtractorDescriptions = function() {
          return __awaiter(this, void 0, void 0, function() {
            var ytDlpStdout;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.execPromise(["--extractor-descriptions"])];
                case 1:
                  ytDlpStdout = _a.sent();
                  return [2, ytDlpStdout.split("\n")];
              }
            });
          });
        };
        YTDlpWrap3.prototype.getHelp = function() {
          return __awaiter(this, void 0, void 0, function() {
            var ytDlpStdout;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.execPromise(["--help"])];
                case 1:
                  ytDlpStdout = _a.sent();
                  return [2, ytDlpStdout];
              }
            });
          });
        };
        YTDlpWrap3.prototype.getUserAgent = function() {
          return __awaiter(this, void 0, void 0, function() {
            var ytDlpStdout;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.execPromise(["--dump-user-agent"])];
                case 1:
                  ytDlpStdout = _a.sent();
                  return [2, ytDlpStdout];
              }
            });
          });
        };
        YTDlpWrap3.prototype.getVersion = function() {
          return __awaiter(this, void 0, void 0, function() {
            var ytDlpStdout;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.execPromise(["--version"])];
                case 1:
                  ytDlpStdout = _a.sent();
                  return [2, ytDlpStdout];
              }
            });
          });
        };
        YTDlpWrap3.prototype.getVideoInfo = function(ytDlpArguments) {
          return __awaiter(this, void 0, void 0, function() {
            var ytDlpStdout;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (typeof ytDlpArguments == "string")
                    ytDlpArguments = [ytDlpArguments];
                  if (!ytDlpArguments.includes("-f") && !ytDlpArguments.includes("--format"))
                    ytDlpArguments = ytDlpArguments.concat(["-f", "best"]);
                  return [4, this.execPromise(ytDlpArguments.concat(["--dump-json"]))];
                case 1:
                  ytDlpStdout = _a.sent();
                  try {
                    return [2, JSON.parse(ytDlpStdout)];
                  } catch (e) {
                    return [2, JSON.parse("[" + ytDlpStdout.replace(/\n/g, ",").slice(0, -1) + "]")];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YTDlpWrap3.bindAbortSignal = function(signal, process7) {
          signal === null || signal === void 0 ? void 0 : signal.addEventListener("abort", function() {
            try {
              if (os_1.default.platform() === "win32")
                (0, child_process_1.execSync)("taskkill /pid ".concat(process7.pid, " /T /F"));
              else {
                (0, child_process_1.execSync)("pgrep -P ".concat(process7.pid, " | xargs -L 1 kill"));
              }
            } catch (e) {
            } finally {
              process7.kill();
            }
          });
        };
        YTDlpWrap3.setDefaultOptions = function(options) {
          if (!options.maxBuffer)
            options.maxBuffer = 1024 * 1024 * 1024;
          return options;
        };
        YTDlpWrap3.createError = function(code, processError, stderrData) {
          var errorMessage = "\nError code: " + code;
          if (processError)
            errorMessage += "\n\nProcess error:\n" + processError;
          if (stderrData)
            errorMessage += "\n\nStderr:\n" + stderrData;
          return new Error(errorMessage);
        };
        YTDlpWrap3.emitYoutubeDlEvents = function(stringData, emitter) {
          var outputLines = stringData.split(/\r|\n/g).filter(Boolean);
          for (var _i = 0, outputLines_1 = outputLines; _i < outputLines_1.length; _i++) {
            var outputLine = outputLines_1[_i];
            if (outputLine[0] == "[") {
              var progressMatch = outputLine.match(progressRegex);
              if (progressMatch) {
                var progressObject = {};
                progressObject.percent = parseFloat(progressMatch[1].replace("%", ""));
                progressObject.totalSize = progressMatch[2].replace("~", "");
                progressObject.currentSpeed = progressMatch[4];
                progressObject.eta = progressMatch[6];
                emitter.emit("progress", progressObject);
              }
              var eventType = outputLine.split(" ")[0].replace("[", "").replace("]", "");
              var eventData = outputLine.substring(outputLine.indexOf(" "), outputLine.length);
              emitter.emit("ytDlpEvent", eventType, eventData);
            }
          }
        };
        return YTDlpWrap3;
      }()
    );
    exports.default = YTDlpWrap2;
  }
});

// src/helper.ts
function getStaticFilesPath() {
  return path.join(global.rootPath(), "static");
}
function isPackaged() {
  return process.env.dev !== "1";
}
function appEntryPointPath() {
  return path.dirname(process.execPath);
}
function appTempDir(appName) {
  const tmpDir = os.tmpdir();
  const tempDirPath = path.join(tmpDir, appName);
  console.log("temp dir", tempDirPath);
  try {
    fs.mkdirSync(tempDirPath);
  } catch (e) {
  }
  return tempDirPath;
}
function checkWritePermissionSync(dirPath) {
  const testFilePath = path.join(dirPath, "testWritePermission.txt");
  try {
    fs.writeFileSync(testFilePath, "Test content");
    fs.unlinkSync(testFilePath);
    return true;
  } catch (error) {
    return false;
  }
}
function getGui() {
  const thePath = path.join(appEntryPointPath(), "gui.node");
  if (fs.pathExistsSync(thePath))
    return thePath;
  console.log("self extracting gui.node");
  try {
    fs.writeFileSync(thePath, fs.readFileSync(path.join(global.rootPath(), "gui.node")));
  } catch (e) {
    const error = e;
    if (error.code === "EPERM") {
      throw new Error("no permissions to extract necessary files in current dir");
    } else {
      throw e;
    }
  }
  return thePath;
}
async function downloadFromGithubFix(filePath, version, platform3 = os.platform()) {
  const isWin32 = platform3 == "win32";
  let fileName = `yt-dlp.exe`;
  if (!isWin32) {
    fileName = "yt-dlp_linux";
  }
  if (!version) {
    version = (await import_yt_dlp_wrap.default.getGithubReleases(1, 1))[0].tag_name;
  }
  if (!filePath)
    filePath = "./" + fileName;
  let fileURL = "https://github.com/yt-dlp/yt-dlp/releases/download/" + version + "/" + fileName;
  await import_yt_dlp_wrap.default.downloadFile(fileURL, filePath);
  !isWin32 && fs.chmodSync(filePath, "777");
}
function extractWebViewDll(onError) {
  if (process.platform !== "win32")
    return;
  const thePath = path.join(appEntryPointPath(), "WebView2Loader.dll");
  if (fs.pathExistsSync(thePath))
    return thePath;
  console.log("self extracting WebView2Loader.dll");
  try {
    fs.writeFileSync(thePath, fs.readFileSync(path.join(global.rootPath(), "WebView2Loader.dll")));
  } catch (e) {
    const error = e;
    let errMsg = error?.message || String(e);
    if (error.code === "EPERM") {
      errMsg = "no permissions to extract necessary files in current dir";
    }
    onError(errMsg);
  }
  return thePath;
}
var path, fs, os, import_yt_dlp_wrap;
var init_helper = __esm({
  "src/helper.ts"() {
    path = __toESM(require("path"));
    fs = __toESM(require_lib());
    os = __toESM(require("os"));
    import_yt_dlp_wrap = __toESM(require_dist());
  }
});

// node_modules/yue-helper/dist/backend.js
function parseArgs(...args) {
  const argObject = {};
  const eventName = args.shift();
  for (let i = 0; i < args.length; i++) {
    argObject[`arg${i}`] = args[i];
  }
  return { eventName, argObject };
}
function escapeBackslashes(str) {
  try {
    if (typeof str !== "string")
      return str;
    return str.replace(/\\/g, "\\\\");
  } catch (e) {
    console.warn("debug");
    return null;
  }
}
function toArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}
var fs2, __require, YueHelper;
var init_backend = __esm({
  "node_modules/yue-helper/dist/backend.js"() {
    fs2 = __toESM(require("fs"), 1);
    __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
      get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
    }) : x)(function(x) {
      if (typeof require !== "undefined")
        return require.apply(this, arguments);
      throw Error('Dynamic require of "' + x + '" is not supported');
    });
    YueHelper = class {
      gui;
      browser;
      constructor() {
      }
      static loadLib(path5) {
        const instance = new this();
        instance.gui = __require(path5);
        return instance;
      }
      createBrowser(handler) {
        this.browser = this.gui.Browser.create(
          {
            allowFileAccessFromFiles: true,
            contextMenu: true,
            webview2Support: true,
            devtools: true
          }
        );
        this.browser.addBinding(
          "ipc",
          async (...args) => {
            const { eventName, argObject } = parseArgs(...args);
            if (typeof eventName !== "string")
              return;
            const responded = { value: false };
            const responseCallback = (response) => {
              if (responded.value) {
                console.error("ipc response called twice", eventName);
                return;
              }
              responded.value = true;
              this.emit(`_${eventName}`, response).catch(() => {
              });
            };
            try {
              await handler(eventName, argObject, responseCallback);
            } finally {
              process.nextTick(
                () => {
                  if (!responded.value) {
                    responseCallback(null);
                  }
                }
              );
            }
          }
        );
        return this.browser;
      }
      showInfoMessage(msg) {
        const box = this.gui.MessageBox.create();
        box.setType("information");
        box.setText("Message");
        box.setInformativeText(msg);
        box.run();
      }
      showErrorMessage(msg) {
        const box = this.gui.MessageBox.create();
        box.setType("error");
        box.setText("Error");
        box.setInformativeText(msg);
        box.run();
      }
      createNativeImage(path5, size = 1) {
        return this.gui.Image.createFromBuffer(toArrayBuffer(fs2.readFileSync(path5)), size);
      }
      emit(name, arg = "") {
        return new Promise(
          (resolve, reject) => {
            this.browser.executeJavaScript(
              `window['EE'].emit('${name}','${escapeBackslashes(arg)}')`,
              (success, result) => {
                resolve(result);
              }
            );
          }
        );
      }
    };
  }
});

// node_modules/is-docker/index.js
function hasDockerEnv() {
  try {
    import_node_fs.default.statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
}
function hasDockerCGroup() {
  try {
    return import_node_fs.default.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return false;
  }
}
function isDocker() {
  if (isDockerCached === void 0) {
    isDockerCached = hasDockerEnv() || hasDockerCGroup();
  }
  return isDockerCached;
}
var import_node_fs, isDockerCached;
var init_is_docker = __esm({
  "node_modules/is-docker/index.js"() {
    import_node_fs = __toESM(require("node:fs"), 1);
  }
});

// node_modules/is-inside-container/index.js
function isInsideContainer() {
  if (cachedResult === void 0) {
    cachedResult = hasContainerEnv() || isDocker();
  }
  return cachedResult;
}
var import_node_fs2, cachedResult, hasContainerEnv;
var init_is_inside_container = __esm({
  "node_modules/is-inside-container/index.js"() {
    import_node_fs2 = __toESM(require("node:fs"), 1);
    init_is_docker();
    hasContainerEnv = () => {
      try {
        import_node_fs2.default.statSync("/run/.containerenv");
        return true;
      } catch {
        return false;
      }
    };
  }
});

// node_modules/is-wsl/index.js
var import_node_process, import_node_os, import_node_fs3, isWsl, is_wsl_default;
var init_is_wsl = __esm({
  "node_modules/is-wsl/index.js"() {
    import_node_process = __toESM(require("node:process"), 1);
    import_node_os = __toESM(require("node:os"), 1);
    import_node_fs3 = __toESM(require("node:fs"), 1);
    init_is_inside_container();
    isWsl = () => {
      if (import_node_process.default.platform !== "linux") {
        return false;
      }
      if (import_node_os.default.release().toLowerCase().includes("microsoft")) {
        if (isInsideContainer()) {
          return false;
        }
        return true;
      }
      try {
        return import_node_fs3.default.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !isInsideContainer() : false;
      } catch {
        return false;
      }
    };
    is_wsl_default = import_node_process.default.env.__IS_WSL_TEST__ ? isWsl : isWsl();
  }
});

// node_modules/define-lazy-prop/index.js
function defineLazyProperty(object, propertyName, valueGetter) {
  const define = (value) => Object.defineProperty(object, propertyName, { value, enumerable: true, writable: true });
  Object.defineProperty(object, propertyName, {
    configurable: true,
    enumerable: true,
    get() {
      const result = valueGetter();
      define(result);
      return result;
    },
    set(value) {
      define(value);
    }
  });
  return object;
}
var init_define_lazy_prop = __esm({
  "node_modules/define-lazy-prop/index.js"() {
  }
});

// node_modules/default-browser-id/index.js
async function defaultBrowserId() {
  if (import_node_process2.default.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const { stdout } = await execFileAsync("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
  const match = /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(stdout);
  return match?.groups.id ?? "com.apple.Safari";
}
var import_node_util, import_node_process2, import_node_child_process, execFileAsync;
var init_default_browser_id = __esm({
  "node_modules/default-browser-id/index.js"() {
    import_node_util = require("node:util");
    import_node_process2 = __toESM(require("node:process"), 1);
    import_node_child_process = require("node:child_process");
    execFileAsync = (0, import_node_util.promisify)(import_node_child_process.execFile);
  }
});

// node_modules/run-applescript/index.js
async function runAppleScript(script, { humanReadableOutput = true } = {}) {
  if (import_node_process3.default.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const outputArguments = humanReadableOutput ? [] : ["-ss"];
  const { stdout } = await execFileAsync2("osascript", ["-e", script, outputArguments]);
  return stdout.trim();
}
var import_node_process3, import_node_util2, import_node_child_process2, execFileAsync2;
var init_run_applescript = __esm({
  "node_modules/run-applescript/index.js"() {
    import_node_process3 = __toESM(require("node:process"), 1);
    import_node_util2 = require("node:util");
    import_node_child_process2 = require("node:child_process");
    execFileAsync2 = (0, import_node_util2.promisify)(import_node_child_process2.execFile);
  }
});

// node_modules/bundle-name/index.js
async function bundleName(bundleId) {
  return runAppleScript(`tell application "Finder" to set app_path to application file id "${bundleId}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
}
var init_bundle_name = __esm({
  "node_modules/bundle-name/index.js"() {
    init_run_applescript();
  }
});

// node_modules/default-browser/windows.js
async function defaultBrowser(_execFileAsync = execFileAsync3) {
  const { stdout } = await _execFileAsync("reg", [
    "QUERY",
    " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
    "/v",
    "ProgId"
  ]);
  const match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(stdout);
  if (!match) {
    throw new UnknownBrowserError(`Cannot find Windows browser in stdout: ${JSON.stringify(stdout)}`);
  }
  const { id } = match.groups;
  const browser = windowsBrowserProgIds[id];
  if (!browser) {
    throw new UnknownBrowserError(`Unknown browser ID: ${id}`);
  }
  return browser;
}
var import_node_util3, import_node_child_process3, execFileAsync3, windowsBrowserProgIds, UnknownBrowserError;
var init_windows = __esm({
  "node_modules/default-browser/windows.js"() {
    import_node_util3 = require("node:util");
    import_node_child_process3 = require("node:child_process");
    execFileAsync3 = (0, import_node_util3.promisify)(import_node_child_process3.execFile);
    windowsBrowserProgIds = {
      AppXq0fevzme2pys62n3e0fbqa7peapykr8v: { name: "Edge", id: "com.microsoft.edge.old" },
      MSEdgeDHTML: { name: "Edge", id: "com.microsoft.edge" },
      // On macOS, it's "com.microsoft.edgemac"
      MSEdgeHTM: { name: "Edge", id: "com.microsoft.edge" },
      // Newer Edge/Win10 releases
      "IE.HTTP": { name: "Internet Explorer", id: "com.microsoft.ie" },
      FirefoxURL: { name: "Firefox", id: "org.mozilla.firefox" },
      ChromeHTML: { name: "Chrome", id: "com.google.chrome" },
      BraveHTML: { name: "Brave", id: "com.brave.Browser" },
      BraveBHTML: { name: "Brave Beta", id: "com.brave.Browser.beta" },
      BraveSSHTM: { name: "Brave Nightly", id: "com.brave.Browser.nightly" }
    };
    UnknownBrowserError = class extends Error {
    };
  }
});

// node_modules/default-browser/index.js
async function defaultBrowser2() {
  if (import_node_process4.default.platform === "darwin") {
    const id = await defaultBrowserId();
    const name = await bundleName(id);
    return { name, id };
  }
  if (import_node_process4.default.platform === "linux") {
    const { stdout } = await execFileAsync4("xdg-mime", ["query", "default", "x-scheme-handler/http"]);
    const id = stdout.trim();
    const name = titleize(id.replace(/.desktop$/, "").replace("-", " "));
    return { name, id };
  }
  if (import_node_process4.default.platform === "win32") {
    return defaultBrowser();
  }
  throw new Error("Only macOS, Linux, and Windows are supported");
}
var import_node_util4, import_node_process4, import_node_child_process4, execFileAsync4, titleize;
var init_default_browser = __esm({
  "node_modules/default-browser/index.js"() {
    import_node_util4 = require("node:util");
    import_node_process4 = __toESM(require("node:process"), 1);
    import_node_child_process4 = require("node:child_process");
    init_default_browser_id();
    init_bundle_name();
    init_windows();
    execFileAsync4 = (0, import_node_util4.promisify)(import_node_child_process4.execFile);
    titleize = (string) => string.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (x) => x.toUpperCase());
  }
});

// node_modules/open/index.js
function detectArchBinary(binary) {
  if (typeof binary === "string" || Array.isArray(binary)) {
    return binary;
  }
  const { [arch]: archBinary } = binary;
  if (!archBinary) {
    throw new Error(`${arch} is not supported`);
  }
  return archBinary;
}
function detectPlatformBinary({ [platform2]: platformBinary }, { wsl }) {
  if (wsl && is_wsl_default) {
    return detectArchBinary(wsl);
  }
  if (!platformBinary) {
    throw new Error(`${platform2} is not supported`);
  }
  return detectArchBinary(platformBinary);
}
var import_node_process5, import_node_buffer, import_node_path, import_node_url, import_node_child_process5, import_promises, __dirname2, localXdgOpenPath, platform2, arch, getWslDrivesMountPoint, pTryEach, baseOpen, open, apps, open_default;
var init_open = __esm({
  "node_modules/open/index.js"() {
    import_node_process5 = __toESM(require("node:process"), 1);
    import_node_buffer = require("node:buffer");
    import_node_path = __toESM(require("node:path"), 1);
    import_node_url = require("node:url");
    import_node_child_process5 = __toESM(require("node:child_process"), 1);
    import_promises = __toESM(require("node:fs/promises"), 1);
    init_is_wsl();
    init_define_lazy_prop();
    init_default_browser();
    init_is_inside_container();
    __dirname2 = import_node_path.default.dirname((0, import_node_url.fileURLToPath)(fixPathImportESM));
    localXdgOpenPath = import_node_path.default.join(__dirname2, "xdg-open");
    ({ platform: platform2, arch } = import_node_process5.default);
    getWslDrivesMountPoint = (() => {
      const defaultMountPoint = "/mnt/";
      let mountPoint;
      return async function() {
        if (mountPoint) {
          return mountPoint;
        }
        const configFilePath = "/etc/wsl.conf";
        let isConfigFileExists = false;
        try {
          await import_promises.default.access(configFilePath, import_promises.constants.F_OK);
          isConfigFileExists = true;
        } catch {
        }
        if (!isConfigFileExists) {
          return defaultMountPoint;
        }
        const configContent = await import_promises.default.readFile(configFilePath, { encoding: "utf8" });
        const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);
        if (!configMountPoint) {
          return defaultMountPoint;
        }
        mountPoint = configMountPoint.groups.mountPoint.trim();
        mountPoint = mountPoint.endsWith("/") ? mountPoint : `${mountPoint}/`;
        return mountPoint;
      };
    })();
    pTryEach = async (array, mapper) => {
      let latestError;
      for (const item of array) {
        try {
          return await mapper(item);
        } catch (error) {
          latestError = error;
        }
      }
      throw latestError;
    };
    baseOpen = async (options) => {
      options = {
        wait: false,
        background: false,
        newInstance: false,
        allowNonzeroExitCode: false,
        ...options
      };
      if (Array.isArray(options.app)) {
        return pTryEach(options.app, (singleApp) => baseOpen({
          ...options,
          app: singleApp
        }));
      }
      let { name: app, arguments: appArguments = [] } = options.app ?? {};
      appArguments = [...appArguments];
      if (Array.isArray(app)) {
        return pTryEach(app, (appName) => baseOpen({
          ...options,
          app: {
            name: appName,
            arguments: appArguments
          }
        }));
      }
      if (app === "browser" || app === "browserPrivate") {
        const ids = {
          "com.google.chrome": "chrome",
          "google-chrome.desktop": "chrome",
          "org.mozilla.firefox": "firefox",
          "firefox.desktop": "firefox",
          "com.microsoft.msedge": "edge",
          "com.microsoft.edge": "edge",
          "microsoft-edge.desktop": "edge"
        };
        const flags = {
          chrome: "--incognito",
          firefox: "--private-window",
          edge: "--inPrivate"
        };
        const browser = await defaultBrowser2();
        if (browser.id in ids) {
          const browserName = ids[browser.id];
          if (app === "browserPrivate") {
            appArguments.push(flags[browserName]);
          }
          return baseOpen({
            ...options,
            app: {
              name: apps[browserName],
              arguments: appArguments
            }
          });
        }
        throw new Error(`${browser.name} is not supported as a default browser`);
      }
      let command;
      const cliArguments = [];
      const childProcessOptions = {};
      if (platform2 === "darwin") {
        command = "open";
        if (options.wait) {
          cliArguments.push("--wait-apps");
        }
        if (options.background) {
          cliArguments.push("--background");
        }
        if (options.newInstance) {
          cliArguments.push("--new");
        }
        if (app) {
          cliArguments.push("-a", app);
        }
      } else if (platform2 === "win32" || is_wsl_default && !isInsideContainer() && !app) {
        const mountPoint = await getWslDrivesMountPoint();
        command = is_wsl_default ? `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${import_node_process5.default.env.SYSTEMROOT || import_node_process5.default.env.windir || "C:\\Windows"}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
        cliArguments.push(
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-EncodedCommand"
        );
        if (!is_wsl_default) {
          childProcessOptions.windowsVerbatimArguments = true;
        }
        const encodedArguments = ["Start"];
        if (options.wait) {
          encodedArguments.push("-Wait");
        }
        if (app) {
          encodedArguments.push(`"\`"${app}\`""`);
          if (options.target) {
            appArguments.push(options.target);
          }
        } else if (options.target) {
          encodedArguments.push(`"${options.target}"`);
        }
        if (appArguments.length > 0) {
          appArguments = appArguments.map((argument) => `"\`"${argument}\`""`);
          encodedArguments.push("-ArgumentList", appArguments.join(","));
        }
        options.target = import_node_buffer.Buffer.from(encodedArguments.join(" "), "utf16le").toString("base64");
      } else {
        if (app) {
          command = app;
        } else {
          const isBundled = !__dirname2 || __dirname2 === "/";
          let exeLocalXdgOpen = false;
          try {
            await import_promises.default.access(localXdgOpenPath, import_promises.constants.X_OK);
            exeLocalXdgOpen = true;
          } catch {
          }
          const useSystemXdgOpen = import_node_process5.default.versions.electron ?? (platform2 === "android" || isBundled || !exeLocalXdgOpen);
          command = useSystemXdgOpen ? "xdg-open" : localXdgOpenPath;
        }
        if (appArguments.length > 0) {
          cliArguments.push(...appArguments);
        }
        if (!options.wait) {
          childProcessOptions.stdio = "ignore";
          childProcessOptions.detached = true;
        }
      }
      if (platform2 === "darwin" && appArguments.length > 0) {
        cliArguments.push("--args", ...appArguments);
      }
      if (options.target) {
        cliArguments.push(options.target);
      }
      const subprocess = import_node_child_process5.default.spawn(command, cliArguments, childProcessOptions);
      if (options.wait) {
        return new Promise((resolve, reject) => {
          subprocess.once("error", reject);
          subprocess.once("close", (exitCode) => {
            if (!options.allowNonzeroExitCode && exitCode > 0) {
              reject(new Error(`Exited with code ${exitCode}`));
              return;
            }
            resolve(subprocess);
          });
        });
      }
      subprocess.unref();
      return subprocess;
    };
    open = (target, options) => {
      if (typeof target !== "string") {
        throw new TypeError("Expected a `target`");
      }
      return baseOpen({
        ...options,
        target
      });
    };
    apps = {};
    defineLazyProperty(apps, "chrome", () => detectPlatformBinary({
      darwin: "google chrome",
      win32: "chrome",
      linux: ["google-chrome", "google-chrome-stable", "chromium"]
    }, {
      wsl: {
        ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
      }
    }));
    defineLazyProperty(apps, "firefox", () => detectPlatformBinary({
      darwin: "firefox",
      win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
      linux: "firefox"
    }, {
      wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
    }));
    defineLazyProperty(apps, "edge", () => detectPlatformBinary({
      darwin: "microsoft edge",
      win32: "msedge",
      linux: ["microsoft-edge", "microsoft-edge-dev"]
    }, {
      wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
    }));
    defineLazyProperty(apps, "browser", () => "browser");
    defineLazyProperty(apps, "browserPrivate", () => "browserPrivate");
    open_default = open;
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  start: () => start
});
async function get_ytdlp() {
  const bin = path3.join(appTempDir("yueApp"), "yt-dlp.exe");
  if (!fs7.existsSync(bin)) {
    yueHelper.emit("dlp-data", `downloading yt-dlp to ${bin}...`).catch(() => {
    });
    await downloadFromGithubFix(bin);
  }
  const downloader = new import_yt_dlp_wrap2.default(bin);
  return downloader;
}
function setupWindow() {
  win = gui.Window.create({ frame: process.platform !== "win32", transparent: false });
  win.setResizable(true);
  win.setMaximizable(false);
  win.setContentSize({ width: 700, height: 700 });
  win.onClose = () => {
    gui.MessageLoop.quit();
  };
  win.setTitle("YT-DLP Gui");
  keep.add(win);
  win.center();
  win.activate();
  return win;
}
function protocolFunction(asar) {
  if (isPackaged()) {
    return (resource) => asar.createJob(path3.join("static", resource));
  } else {
    return (resource) => gui.ProtocolFileJob.create(path3.join(getStaticFilesPath(), resource));
  }
}
function selectFolderDialog() {
  const dialog = gui.FileOpenDialog.create();
  dialog.setOptions(1);
  const result = dialog.runForWindow(win);
  if (result) {
    return dialog.getResult();
  }
  return void 0;
}
async function downloadVid({ url, quality }, path5) {
  if (!path5)
    return;
  let formart = "";
  switch (quality) {
    case "Medium":
      formart = `bestvideo[height<=720]+bestaudio/best[height<=720]`;
      break;
    case "Low":
      formart = `bestvideo[height<=480]+bestaudio/best[height<=480]`;
      break;
  }
  const cmd = [url, "-P", path5, "-P", `temp:${import_os.default.tmpdir()}`];
  if (quality !== "Highest") {
    console.log(formart);
    cmd.push(...["-f", formart]);
  }
  try {
    const job = (await get_ytdlp()).exec(cmd);
    job.on(
      "ytDlpEvent",
      (event, data) => {
        yueHelper.emit("dlp-data", data);
      }
    );
    job.on(
      "close",
      (code) => {
        if (code === 0) {
          open_default(path5).catch(() => {
          });
        }
      }
    );
    job.on(
      "error",
      (error) => {
        const errMsg = error?.message || String(error);
        yueHelper.showErrorMessage(error?.message || String(error));
        yueHelper.emit("dlp-data", errMsg);
      }
    );
  } catch (e) {
    console.error(e);
    yueHelper.emit("dlp-data", "");
    yueHelper.showErrorMessage(e?.message || String(e));
  }
}
async function start() {
  const staticPath = getStaticFilesPath();
  const asarFile = gui.myClass.create(process.execPath);
  if (isPackaged()) {
    asarFile.parse();
  }
  const protocol = protocolFunction(asarFile);
  const win2 = setupWindow();
  const container = gui.Container.create();
  gui.Browser.registerProtocol(
    "app",
    (url) => {
      const resource = { value: decodeURIComponent(new URL(url).pathname) };
      if (resource.value === "/" || !resource.value) {
        resource.value = "index.html";
      }
      const fullPath = path3.join(staticPath, resource.value);
      try {
        fs7.accessSync(fullPath);
      } catch (e) {
        console.log("file not found", fullPath);
        if (path3.extname(resource.value).length > 0) {
          return void 0;
        }
        resource.value = "index.html";
      }
      return protocol(resource.value);
    }
  );
  extractWebViewDll((e) => yueHelper.showErrorMessage(e));
  const browser = yueHelper.createBrowser(
    async (eventName, args, cb) => {
      switch (eventName) {
        case "test": {
          break;
        }
        case "download": {
          const path5 = selectFolderDialog();
          if (!path5) {
            return;
          }
          if (!checkWritePermissionSync(path5)) {
            yueHelper.showErrorMessage(`no permission to write files in path ${path5}`);
            return;
          }
          Promise.resolve().then(() => downloadVid(JSON.parse(args.arg0), path5));
          cb("1");
          break;
        }
        default:
          break;
      }
    }
  );
  browser.setStyle({ flex: 1 });
  if (isPackaged()) {
    browser.loadURL("app://_");
  } else {
    browser.loadURL("http://localhost:5173/");
  }
  if (process.platform === "win32") {
    const titleBar = gui.Container.create();
    titleBar.setStyle({ width: "100%", minheight: 30, position: "relative", flexdirection: "row" });
    const buttonsContainer = gui.Container.create();
    buttonsContainer.setStyle({ flexdirection: "row", flex: 1, justifyContent: "flex-end", gap: 3 });
    buttonsContainer.setMouseDownCanMoveWindow(true);
    const close = gui.Button.create("");
    close.setBackgroundColor("#343434");
    close.setTooltip("Close");
    close.onClick = () => {
      win2.close();
    };
    const title = gui.Label.create("YT-DLP Gui");
    title.setColor("white");
    title.setStyle({ alignSelf: "center" });
    title.setMouseDownCanMoveWindow(true);
    const minimize = gui.Button.create("");
    minimize.setImage(yueHelper.createNativeImage(path3.join(global.rootPath(), "minimize.png"), 15));
    minimize.setStyle({ width: "100px" });
    close.setStyle({ width: "100px" });
    minimize.setTooltip("Minimize");
    minimize.setBackgroundColor("#343434");
    close.setImage(yueHelper.createNativeImage(path3.join(global.rootPath(), "close.png"), 15));
    minimize.onClick = () => win2.minimize();
    titleBar.setMouseDownCanMoveWindow(true);
    titleBar.addChildView(title);
    buttonsContainer.addChildView(minimize);
    buttonsContainer.addChildView(close);
    titleBar.addChildView(buttonsContainer);
    container.addChildViewAt(titleBar, 0);
  }
  container.addChildView(browser);
  container.setBackgroundColor("#282828");
  win2.setContentView(container);
  win2.shouldClose = (window) => {
    gui.MessageLoop.postTask(
      () => {
        const box = gui.MessageBox.create();
        box.setText("Confirm");
        box.setType("warning");
        box.setInformativeText("Are you sure you want to close the app?");
        box.addButton("Yes", 1);
        box.addButton("no", 0);
        const response = box.runForWindow(window);
        if (response === 1)
          process.exit(1);
      }
    );
    return false;
  };
}
var fs7, path3, import_yt_dlp_wrap2, import_os, yueHelper, gui, win, keep;
var init_main = __esm({
  "src/main.ts"() {
    init_helper();
    fs7 = __toESM(require("fs"));
    path3 = __toESM(require("path"));
    import_yt_dlp_wrap2 = __toESM(require_dist());
    init_backend();
    import_os = __toESM(require("os"));
    init_open();
    yueHelper = YueHelper.loadLib(getGui());
    gui = yueHelper.gui;
    keep = /* @__PURE__ */ new Set();
    process.on("uncaughtException", (err) => yueHelper.showErrorMessage(err.message));
  }
});

// start_ts.ts
var fs8 = require_lib();
var path4 = require("path");
async function start2() {
  const root = path4.join(process.execPath, "asar");
  global.rootPath = () => root;
  await (init_main(), __toCommonJS(main_exports)).start();
}
(async () => await start2())();
