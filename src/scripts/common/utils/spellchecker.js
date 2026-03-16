import path from 'path';
import fs from 'fs';

import app from 'common/electron/app';
import platform from 'common/utils/platform';
import files from 'common/utils/files';

let hunspellDictionarySearchPaths = null;
let availableDictionaries = null;

function statSyncNoException (p) {
  try {
    return fs.statSync(p);
  } catch (e) {
    return null;
  }
}

export function getDictionarySearchPaths () {
  if (hunspellDictionarySearchPaths) {
    return hunspellDictionarySearchPaths;
  }

  let searchPaths = [
    path.join(app.getAppPath(), 'dicts'),
    // Legacy path for the deprecated `spellchecker` native module.
    // Kept for backwards-compatibility when users have their own dictionaries bundled.
    path.join(app.getAppPath(), 'node_modules', 'spellchecker', 'vendor', 'hunspell_dictionaries')
  ];

  // Special case being in an asar archive
  searchPaths = searchPaths.map((searchPath) => {
    if (searchPath.includes('.asar' + path.sep)) {
      const unpacked = searchPath.replace('.asar' + path.sep, '.asar.unpacked' + path.sep);
      if (statSyncNoException(unpacked)) {
        return unpacked;
      }
    }
    return searchPath;
  });

  if (platform.isLinux) {
    searchPaths = searchPaths.concat([
      '/usr/share/hunspell',
      '/usr/share/myspell',
      '/usr/share/myspell/dicts',
      '/Library/Spelling'
    ]);
  }

  hunspellDictionarySearchPaths = searchPaths;
  return hunspellDictionarySearchPaths;
}

export function getAvailableDictionaries () {
  if (availableDictionaries) {
    return availableDictionaries;
  }

  availableDictionaries = []
    .concat(getHunspellDictionaries());

  // Remove duplicates
  availableDictionaries = Array.from(new Set(availableDictionaries));

  return availableDictionaries;
}

function getHunspellDictionaries () {
  try {
    const searchPaths = getDictionarySearchPaths();
    return files.getAllDictionariesSync(searchPaths);
  } catch (err) {
    logError(err);
  }
  return [];
}

export function getDictionaryPath (langCode) {
  let searchPaths = getDictionarySearchPaths();
  searchPaths = searchPaths.map((searchPath) => {
    return [
      path.join(searchPath, langCode.replace('-', '_') + '.dic'),
      path.join(searchPath, langCode.replace('_', '-') + '.dic')
    ];
  });

  // Flatten and remove duplicates
  searchPaths = [].concat.apply([], searchPaths);
  searchPaths = Array.from(new Set(searchPaths));

  return searchPaths.find((searchPath) => statSyncNoException(searchPath));
}
