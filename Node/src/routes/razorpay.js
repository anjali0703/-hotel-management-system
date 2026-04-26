const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "YOUR_KEY",
  key_secret: "YOUR_SECRET",
});

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100, // paisa
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
  });

  res.json(order);
});