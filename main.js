let miniGameBrowser = null;

mp.events.add("openSupplierMiniGame", () => {
    miniGameBrowser = mp.browsers.new('');
    mp.gui.cursor.show(true, true);
});

mp.events.add('terminateJob', () => {
    mp.events.callRemote('endJob');
    if(mp.browsers.exists(miniGameBrowser)) {
        miniGameBrowser.destroy();
    }
    mp.gui.cursor.show(false, false);
});

mp.events.add('startSupplier', (packages) => {
    mp.events.callRemote('startSupply', (packages));
    if(mp.browsers.exists(miniGameBrowser)) {
        miniGameBrowser.destroy();
    }
    mp.gui.cursor.show(false, false);
});