import app from "./src/app/app.js"
import config from "./src/config/config.js"
import connectDB from "./src/config/db.js";


const PORT = config.PORT;

await connectDB()


app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))