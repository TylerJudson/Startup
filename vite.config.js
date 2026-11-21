import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost:4000',
            // SENDS THE WEBSOCKET TO THE BACKEND WHEN RUNNING WITH NPM RUN DEV
            '/ws': {
                target: 'ws://localhost:4000',
                ws: true,
            },
        },
    },
});
