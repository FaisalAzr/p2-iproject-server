const express = require("express");
const app = express();
const port = process.env.PORT || 5050;
const cors = require("cors");
const { Food } = require("./models/index");
const bcrypt = require("bcrypt");
const {Op} = require("sequelize")
const TransactionController = require("./controllers/TransactionController");
// const { createToken, readPayLoad } = require("./helper/jwt");

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ where: { email } });

    const correctPassword = bcrypt.compareSync(password, foundUser.password);

    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }

    if (!correctPassword || !foundUser) {
      throw new Error("Invalid email/password");
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
    };

    const access_token = createToken(payload);

    res.status(200).json({
      access_token: access_token,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const auth = (req, res, next) => {
  try {
    const access_token = req.headers.access_token;

    if (!access_token) {
      throw new Error("Invalid Token");
    }

    const payload = readPayLoad(access_token);

    if (!payload) {
      throw new Error("Invalid Token");
    }

    req.UserInfo = {
      id: payload.id,
      email: payload.email,
    };
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

app.get("/foods", async (req, res, next) => {
  try {
    const name = req.query.name ? `%${req.query.name}%` : "%%";
    const readFood = await Food.findAll({
      where: {
        name: {
          [Op.iLike]: name,
        },  
      },
    });

    res.status(200).json({
      data: readFood,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/payment",TransactionController.payment);


app.use((error, req, res, next) => {
  let code = 500;
  let message = "Internal server Error";

  if (error.name === "SequalizeValidationError") {
    code = 400;
    message = error.errors[0].message;
  }
  if (error.name === "SequalizeUniqueConstraintError") {
    code = 400;
    message = error.errors[0].message;
  }
  if (
    error.name === "Email is required" ||
    error.message === "Password is required" ||
    error.message === "Invalid email/password" ||
    error.message === "Invalid Token" ||
    error.message === "JsonWebTokenError"
  ) {
    code = 401;
    message = error.message;
  }
  if (error.name === "You are not authorized") {
    code = 403;
    message = error.message;
  }

  res.status(code).json({
    message,
  });
});

app.listen(port, () => {
  console.log(`run on port ${port}`);
});
