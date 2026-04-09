// Service worker stub — caching will be added in Phase 2 (offline mode)
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
