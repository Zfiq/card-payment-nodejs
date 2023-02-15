const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const app = express();

var Publishable_Key = "pk_test_51I82Q5I0YkB7dB3Z3iYH******************";
var Secret_Key = "sk_test_51I82Q5I0YkB7d*********************";

const stripe = require("stripe")(Secret_Key);

const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("Home", {
    key: Publishable_Key,
  });
});

app.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "John Doe",
      address: {
        line1: "North Circular road dublin 7",
        postal_code: "D07Ab0K",
        city: "Dublin",
        state: "IRL",
        country: "Ireland",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 7000, // Charing Rs 70 eur
        description: "New Product some description",
        currency: "Eur",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log("Server created Successfully");
});
