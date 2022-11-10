const dotenv = require("dotenv");
const app = require("./app");
const { connetToMongoDB } = require("./db");

dotenv.config({ path: "/config.env" });

// app.get('/', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         data: 'Hello world'
//     })
// })

connetToMongoDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
