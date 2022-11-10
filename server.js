const dotenv = require("dotenv");
const app = require("./app");
const { connetToMongoDB } = require("./db");

dotenv.config({ path: "/config.env" });

connetToMongoDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
