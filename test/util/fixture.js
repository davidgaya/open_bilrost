/**
* Copyright (C) 2015-2018 Starbreeze AB All Rights Reserved.
*/

'use strict';

const _path = require('path').posix;
const fs = require('fs-extra');

module.exports = name => {
    const path = _path.join(process.cwd().replace(/\\/g, '/'), 'tmp', 'fixtures', name);
    return {
        get_path: () => path,
        create: () => fs.mkdirp(path),
        remove: () => fs.remove(path)
    };
};
