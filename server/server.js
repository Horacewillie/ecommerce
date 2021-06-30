const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const formidableMiddleWare = require("express-formidable");
const saltRounds = 10;

const app = express();
const async = require("async");

require("dotenv").config();
const port = process.env.PORT || 3002;
const localhost = process.env.HOST;

/******* CLOUDINARY CONFIGURATION *********/
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

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

/******* MIDDLEWARES *********/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(express.static('client/build'))

/******* MODELS *********/
const { User } = require("./models/user");
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");
const { Product } = require("./models/products");
const { Payment } = require("./models/payment");
const { Site } = require("./models/site");

/******* CUSTOM MIDDLEWARES *********/
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

/******* AUTHENTICATION ENDPOINT *********/
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).send({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    cart: req.user.cart,
    history: req.user.history,
    role: req.user.role,
    lastname: req.user.lastname,
    email: req.user.email,
    name: req.user.name,
  });
});

/******* PRODUCTS ENDPOINTs *********/
app.post("/api/product/shop", (req, res) => {
  let { filters, skip, limit, order, sortBy } = req.body;

  order ? order : "desc";
  sortBy ? sorBy : "_id";
  skip = +skip;
  limit ? +limit : 100;
  let findArgs = {};

  for (let key in filters) {
    if (filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: filters[key][0],
          $lte: filters[key][1],
        };
      } else {
        findArgs[key] = filters[key];
      }
    }
  }

  findArgs["publish"] = true;

  Product.find(findArgs)
    .populate("brands")
    .populate("woods")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .then((articles) => {
      return res.status(200).json({
        size: articles.length,
        articles,
      });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message,
      });
    });
});

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
/****** BY SOLD ****/
//article?sortby=createdAt&order=desc&limit=4
//article?sortby=sold&order=desc&limit=4

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
      return res.status(200).send(products);
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
    itemsId = ids.map((item) => {
      return mongoose.Types.ObjectId(item);
    });
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
/******* ENCRYPT BEFORE SAVING TO DB **********/
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
            res.status(200).json({
              success: true,
            });
          })
          .catch((err) => {
            res.status(400).json({
              success: false,
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
              return res.cookie("w_auth", user.token).status(200).json({
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

/******* CLOUDINARY IMAGE UPLOAD ENDPOINT *********/
app.post(
  "/api/users/uploadimage",
  auth,
  admin,
  formidableMiddleWare(),
  (req, res) => {
    cloudinary.uploader.upload(
      req.files.file.path,
      (result) => {
        res.status(200).send({
          public_id: result.public_id,
          url: result.url,
        });
      },
      {
        public_id: `${Date.now()}`,
        resource_type: "auto",
      }
    );
  }
);

/******* CLOUDINARY IMAGE REMOVAL ENDPOINT *********/
app.get("/api/users/removeimage", auth, admin, (req, res) => {
  let image_id = req.query.public_id;
  cloudinary.uploader.destroy(image_id, (result) => {
    res.status(200).send("ok");
  });
});

/******* ADDTOCART ENDPOINT *********/
app.post("/api/users/addToCart", auth, (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      let duplicate = false;
      user.cart.forEach((item) => {
        if (item.id == req.query.productId) {
          duplicate = true;
        }
      });
      if (duplicate) {
        User.findOneAndUpdate(
          {
            _id: req.user._id,
            "cart.id": mongoose.Types.ObjectId(req.query.productId),
          },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        )
          .then((product) => {
            res.status(200).json(product.cart);
          })
          .catch((err) => {
            res.status(400).json({
              message: err.message,
            });
          });
      } else {
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              cart: {
                id: mongoose.Types.ObjectId(req.query.productId),
                quantity: 1,
                date: Date.now(),
              },
            },
          },
          //get document back
          { new: true }
        )
          .then((user) => {
            res.status(200).json(user.cart);
          })
          .catch((err) => {
            return res.status(400).json({
              success: false,
              err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
});

/******* REMOVEFROMCART ENDPOINT *********/
app.get("/api/users/removeFromCart", auth, (req, res) => {
  console.log(req.query._id);
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $pull: {
        cart: {
          id: mongoose.Types.ObjectId(req.query._id),
        },
      },
    },
    { new: true }
  )
    .then((product) => {
      let cart = product.cart;
      let array = cart.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });

      Product.find({ _id: { $in: array } })
        .populate("brand")
        .populate("wood")
        .then((cartDetail) => {
          return res.status(200).send({ cartDetail, cart });
        })
        .catch((err) => {
          res.json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.json({
        message: err.message,
      });
    });
});

/******* PURCHASE SUCCESS ENDPOINT *********/
app.post("/api/users/successBuy", auth, (req, res) => {
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      brand: item.brand.name,
      paymentId: req.body.paymentData.paymentID,
    });
  });

  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email,
  };
  transactionData.data = req.body.paymentData;
  transactionData.product = history;

  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $set: { cart: [] },
      $push: { history: history },
    },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });

      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        let products = [];
        doc.product.forEach((item) => {
          products.push({
            id: item.id,
            quantity: item.quantity,
          });
        });
        async.eachSeries(
          products,
          (item, callback) => {
            Product.updateOne(
              { _id: item.id },
              { $inc: { sold: item.quantity } },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json({
              success: true,
              cart: [],
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});

/******* UPDATE ENDPOINT *********/
app.post("/api/users/update_profile", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) return res, json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});

/******* SITE INFO ENDPOINT *********/
app.get("/api/site/site_data", (req, res) => {
  Site.find({}, (err, site) => {
    if (err) return res.status(400).send({ err });
    res.status(200).send(site[0].siteInfo);
  });
});

app.post("/api/site/site_data", auth, admin, (req, res) => {
  Site.findOneAndUpdate(
    {
      name: "Site",
    },
    { $set: { siteInfo: req.body } },
    { new: true }
  ).then((res) => {
    return res.status(200).send({
      success: true,
      siteInfo: res.siteInfo
    })
  }).catch((err) => {
    res.json({success: false, err})
  })
});

// DEFAULT
if( process.env.NODE_ENV === 'production'){
  const path = require('path')
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  })
}

/******* LISTENING TO REQUEST *********/
mongooseConnect(() =>
  app.listen(port, () => {
    console.log(`Server is running at http://${localhost}:${port}`);
  })
);
