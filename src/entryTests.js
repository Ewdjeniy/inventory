function importAll(r) {
    return r.keys().map(r);
}

importAll(require.context('./components', true, /^\.\/.*ts$/));
importAll(require.context('./pages', true, /^\.\/.*ts$/));

importAll(require.context('./components', true, /^\.\/.*js$/));
importAll(require.context('./pages', true, /^\.\/.*js$/));
