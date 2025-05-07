module.exports = {
  apps: [
    {
      name: 'fastapi',
      script: 'uvicorn',
      args: 'server_search_images:app --reload --port 3007',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};