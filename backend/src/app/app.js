import express from "express"
import authRouter from "../routes/user.routes.js"
import productsRouter from "../routes/products.route.js"

const app = express()

app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api/products",productsRouter)


export default app;