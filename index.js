"use strict";

const fs = require('fs');
const url = require('url');
const path = require('path');
const async = require('async');
const semver = require('semver');

module.exports = hierarchize;

function hierarchize (prefix, options) {
  prefix = prefix || '';
  const pkgInfo = require(path.resolve(prefix, './package.json'));
  const RegClient = require('npm-registry-client');
  const client = new RegClient();
  let registry = 'http://registry.npmjs.org/';
  let scope, token;

  try {
    const npmrc = fs.readFileSync(path.resolve(prefix, './.npmrc'), 'utf8');
    const localRegistry = (npmrc.match(/registry=(.*)/ || [])[1]);
    registry = localRegistry || registry;
  } catch (e) {}

  try {
    const npmrc = fs.readFileSync(process.env.HOME + '/.npmrc', 'utf8');
    const registryUrlObj = url.parse(registry);
    const re_token = new RegExp('//' + registryUrlObj.host + '/:_authToken="(.*)"');
    scope = '//' + registryUrlObj.host + '/';
    token = npmrc.match(re_token)[1];
  } catch (e) {}

  let deps = pkgInfo.dependencies || {};
  if (options.dev && Object.keys(pkgInfo.devDependencies || {}).length > 0) {
    deps = Object.assign(deps, pkgInfo.devDependencies);
  }
  request(pkgInfo.name, pkgInfo.version, deps, (err, results) => {
    fs.writeFileSync(
      path.resolve(prefix, './npm-shrinkwrap.json'),
      JSON.stringify(results, null, 2),
      'utf8'
    );
  });

  function request (name, version, deps, cb) {
    let tasks = {};
    for (let name in deps) {
      tasks[name] = (done) => {
        client.get(registry + encodeURIComponent(name), {
          auth: {
            token,
          }
        }, (err, data, raw, res) => {
          if (err) {
            throw err;
          }
          const range = deps[name];
          const expect = semver.maxSatisfying(Object.keys(data.versions || {}), range);
          const subPkg = data.versions[expect];
          if (!subPkg) {
            done(null);
          } else {
            if (!subPkg.dependencies || 
              Object.keys(subPkg.dependencies).length === 0) {
              done(null, {
                name: subPkg.name,
                version: subPkg.version,
                from: range
              });
            } else {
              request(subPkg.name, subPkg.version, subPkg.dependencies, done);
            }
          }
        });
      };
    }
    async.parallel(tasks, (err, dependencies) => {
      cb(err, {
        name,
        version,
        dependencies
      });
    });
  }
}

