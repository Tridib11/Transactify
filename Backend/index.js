const express = require("express");
const mainRouter = require("./routes/index");
const cors=require("cors")
const app = express();

const PORT=3000

app.use(cors())
app.use(express.json())
app.use("/api/v1", mainRouter);

app.get("/",(req,res)=>{
  return res.status(200).json({
    msg:"Server is Running "
  })
})

app.listen(PORT,()=>{
  console.log(`Server started at PORT ${PORT}`)
})
