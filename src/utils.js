(function() {
    const cacheName = 'ConvertHeicToPng';

    async function HeicToPngCacheSize() {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        let size = 0;
        for (let i=0; i<keys.length; i++) {
            const request = await cache.match(keys[i]);
            if (request) {
                const blob = await request.blob();
                if (blob) {
                    size += blob.size;
                }
            }
        };
        return {
            count: keys.length,
            size: size,
        };
    }
    document.HeicToPngCacheSize = HeicToPngCacheSize

    function CleanHeicToPngCache() {
        return caches.delete(cacheName);
    }
    document.CleanHeicToPngCache = CleanHeicToPngCache;
})()
