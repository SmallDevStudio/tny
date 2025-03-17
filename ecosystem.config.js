module.exports = {
    apps: [
      {
        name: "nextjs-app",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
    ],
  };
  