const express = require("express");
const app = express();
const db = require(`mongoose`)
const bp = require(`body-parser`)
const session = require('express-session')


app.use(session({
    secret: '1234567',
    resave: false,
    saveUninitialized: false
}));


app.use(bp.json())

db.connect(`mongodb+srv://123abadodi:aba2dodi@cluster0.qm1vzsg.mongodb.net/svshop`)

const userSchema = db.Schema({
    userName: String,
    email: String,
    password: String
});

const productsSchema = db.Schema({
    name: String,
    price: String,
})

const ordersSchema = db.Schema({
    userName: String,
    productname: String,
})

const userModel = db.model(`user`, userSchema)
const productModel = db.model(`products`, productsSchema)
const ordersModel = db.model(`orders`, ordersSchema)

app.use(express.static("client"));

const requireLogin = (req, res, next) => {
    if (!req.session.userName && !req.session.email) return res.redirect('/home');
    next();
};

app.get("/products", requireLogin, (req, res) => {
    res.sendFile(`${__dirname}/client/products.html`);
});

app.get("/home", function (req, res) {
    res.sendFile(`${__dirname}/client/home.html`);
});

app.post('/home', async (req, res) => {
    req.session.email = req.body.email
    let registeredUser = await userModel.find({ email: req.body.email, password: req.body.password });
    if (registeredUser.length > 0) {
        return res.status(200).json({ email: req.body.email })

    } else {
        return res.status(404).json({ error: "User not found" });
    }
});

app.get("/signup", function (req, res) {
    res.sendFile(`${__dirname}/client/signup.html`);
});

app.post(`/signup`, async (req, res) => {
    let usedEmail = "";
    const user = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    };
    try {
        req.session.userName = req.body.userName;
        usedEmail = await userModel.findOne({ email: req.body.email });
        if (usedEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        await userModel.create(user);
        return res.json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

app.post(`/payment`, async (req, res) => {
    try {
        let user = "";
        user = await userModel.findOne({ email: req.body.userName });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userProducts = {
            userName: user.userName,
            productname: req.body.productname
        };

        await ordersModel.create(userProducts);

        return res.status(200).json({ message: "Order created successfully" });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});



app.get("/buy", function (req, res) {
    res.sendFile(`${__dirname}/client/payment.html`);
});

app.get('/add', async (req, res) => {
    try {
        const allProducts = await productModel.find();
        res.json(allProducts);
        console.log(allProducts)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products from the database');
    }
    
});

app.get("/all", accessToPage, async (req, res) => {
    try {
      const allOrders = await productModel.find();
      res.json(allOrders);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching orders from the database");
    }
  });
function accessToPage(req, res, next) {
    if (req.query.admin == "true") next();
    else {
      res.status(400).json({ error: "NO ACCESS!" });
    }
  }

app.listen(3000, () => {
    console.log("Server is on: 3000");
});
