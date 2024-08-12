export default {
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: "file:./db.sqlite",
  },
};
