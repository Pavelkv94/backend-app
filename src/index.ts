import { db } from "./db/db";
import { initApp } from "./initApp";

const app = initApp();

const url = "mongodb://0.0.0.0:27017";

db.connect(url);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log("...server started in port " + PORT);
});
