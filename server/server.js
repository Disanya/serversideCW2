const app = require("./app");
const PORT = process.env.PORT;

//running the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
