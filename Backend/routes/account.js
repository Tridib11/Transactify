const express=require("express")
const { authMiddleware } = require("../middleware/authMiddleware")
const { Account } = require("../db")
const { default: mongoose } = require("mongoose")

const router=express.Router()


router.get("/balance",authMiddleware,async(req,res)=>{
  const account=await Account.findOne({
    userId:req.userId
  })

  return res.json({
    balance:account.balance
  })
})


router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;
  //fetch the account within the transactions

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Funds",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  //Performing the transfer

  await Account.updateOne({ userId: req.userId },{ $inc: { balance: -amount } }).session(session);
  await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

  //Commiting transactions

  await session.commitTransaction();

  return res.status(200).json({
    message: "Transfer Successfull",
  });

})

module.exports=router