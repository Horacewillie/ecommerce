const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const app = express();

require("dotenv").config();
const port = process.env.PORT || 3002;
const localhost = process.env.HOST;

/******* MONGOOSE CONNECTION *********/
const mongooseConnect = (callback) => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((client) => {
      console.log(
        `Mongodb Connected Successfully, running on ${client.connection._connectionString}`
      );
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("tiny"));

/******* MODELS *********/
const { User } = require("./models/user");
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");
const { Product } = require("./models/products");

/******* MIDDLEWARES *********/
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

/******* AUTHENTICATION ENDPOINT *********/
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).send({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    user: req.user,
  });
});

/******* PRODUCTS ENDPOINTs *********/
app.post("/api/product/article", auth, admin, (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then((product) => {
      res.status(200).json({
        success: true,
        article: product,
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err.message,
      });
    });
});

/****** BY ARRIVAL ****/
//article?sortby=createdAt&order=desc&limit=4

app.get("/api/product/articles", (req, res) => {
  let sortBy = req.query.sortby ? req.query.sortby : "_id";
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.query.limit ? +req.query.limit : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .then((products) => {
      return res.status(200).send(products)
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message,
      });
    });
});
/****** BY ID ****/
//api/product/article?id=HSHSHS,JSJSJSJ,SDSDSDS&type=array
app.get("/api/product/articles_by_id", (req, res) => {
  let type = req.query.type;
  let itemsId = req.query.id;

  if (type === "array") {
    let ids = itemsId.split(",");
    //Convert each id to a mongoose unique id
    itemsId = [];
    console.log(itemsId, "First");
    itemsId = ids.map((item) => {
      return mongoose.Types.ObjectId(item);
    });
    console.log(itemsId);
  }

  Product.find({ _id: { $in: itemsId } })
    .populate("brand")
    .populate("wood")
    .then((products) => {
      return res.status(200).send(products);
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err.message,
      });
    });
});

/******* WOODS ENDPOINTs *********/
app.post("/api/product/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood
    .save()
    .then((wood) => {
      res.status(200).json({
        success: true,
        wood: wood,
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err.message,
      });
    });
});

app.get("/api/product/woods", (req, res) => {
  Wood.find()
    .then((woods) => {
      res.status(200).send(woods);
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err.message,
      });
    });
});

/******* BRANDS ENDPOINT *********/
app.post("/api/product/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand
    .save()
    .then((brand) => {
      return res.status(200).json({
        success: true,
        brand: brand,
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err.message,
      });
    });
});

app.get("/api/product/brands", (req, res) => {
  Brand.find()
    .then((brands) => {
      res.status(200).send(brands);
    })
    .catch((err) => {
      return res.status(400).send({
        message: err.message,
      });
    });
});

/******* USER(S) REGISTRATION ENDPOINT *********/
/******* ENCRYPT BEFORE SAVING TO DB *********/
app.post("/api/users/register", (req, res) => {
  const { password, name, email, lastname } = req.body;
  if (!email || !name || !password || !lastname) {
    return res.status(400).json({
      message: "All fields must be complete!",
    });
  } else {
    bcrypt
      .hash(password, saltRounds)
      .then((hashedPassword) => {
        const user = new User({
          password: hashedPassword,
          name,
          email,
          lastname,
        });
        user
          .save()
          .then((user) => {
            res.status(200).json(user);
          })
          .catch((err) => {
            res.status(400).json({
              message: err.message,
            });
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

/******* USER(S) LOGIN ENDPOINT *********/
/******* COMPARE PASSWORD *********/
/******* GENERATE TOKEN *********/
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user)
      return res.json({
        success: false,
        message: "Authentication failed, no user found",
      });
    else {
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) {
            return res.json({
              success: false,
              message: "User password Incorrect!",
            });
          }
          const token = jwt.sign(user._id.toHexString(), process.env.SECRETKEY);
          user.token = token;
          user
            .save()
            .then((user) => {
              res.cookie("w_auth", user.token).status(200).json({
                success: true,
              });
            })
            .catch((err) => {
              res.status(400).json({
                message: err.message,
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Internal Server Error",
          });
        });
    }
  });
});

/******* USER(S) LOGOUT ENDPOINT *********/
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
      res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        message: err.message,
      });
    });
});

/******* LISTENING TO REQUEST *********/
mongooseConnect(() =>
  app.listen(port, () => {
    console.log(`Server is running at http://${localhost}:${port}`);
  })
);
