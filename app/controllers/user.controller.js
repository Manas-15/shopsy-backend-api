const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  let input = req.body;
  // if (!(input.firstname) || !(input.lastName) || !(input.email) || !(input.password) || !(input.phone) || !(input.gender)) {
  //     res.status(400).send("please flease fill required details.")
  // } else {
  // Create a User
  const user = new User({
    firstname: input.firstname,
    lastname: input.lastname,
    email: input.email,
    password: bcrypt.hashSync(input.password, 8),
    phone: input.phone,
    gender: input.gender,
  });
  // Save User in the database
  user
    .save(user)
    .then((data) => {
      res.send(data);
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });

  // }
};

exports.sendOtp = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then(async (data) => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        data.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const min = 100000;
      const max = 900000;
      const otp = Math.floor(Math.random() * min) + max;

      console.log(otp);

      const filter = { email: data.email };
      const update = { otp: otp };

      let doc = await User.findOneAndUpdate(filter, update)
        .then((result) => {
          res.status(200).json({ otp: otp });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error Occured cannot signin",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error Occured cannot signin",
      });
    });
};

// Find a single User with an id
exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((data) => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        data.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      if (req.body.otp != data.otp) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Otp!",
        });
      }

      var token = jwt.sign(
        {
          _id: data.userName,
        },
        process.env.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );
      console.log(token);
      res.status(200).json({
        username: data.userName,
        email: data.email,
        FirstName: data.FirstName,
        lastname: data.lastName,

        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error Occured cannot signin",
      });
    });
};

exports.resetPassword = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then(async (data) => {
      function generaterandomstring() {
        let charSet =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomString = "";
        for (let i = 0; i < 10; i++) {
          let randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
      }
      const randomString = generaterandomstring();
      const link = `http://localhost:8000/api/v1/${randomString}`;
      console.log(randomString);

      const filter = { email: data.email };
      const update = { TempResetPassward: randomString };

      let doc = await User.findOneAndUpdate(filter, update)
        .then((result) => {
          res
            .status(200)
            .json({
              "Please don't share with anyone! click on the link to reset password.":
                link,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.changepassword = (req, res) => {
  const secretToken = req.params.id;
  console.log(secretToken);
  // res.send(secretToken)
  User.findOne({ TempResetPassward: secretToken })
    .then(async (data) => {
      if (data) {
        // res.send(data)
        const fil = { email: data.email };
        const up = { password: bcrypt.hashSync(req.body.newPassword, 8) };

        let doc = await User.findOneAndUpdate(fil, up).then((result) => {
          res
            .status(200)
            .json({ message: "Your password updated successfully" });
        });
      } else {
        res
          .status(400)
          .send({
            message: "Please click on the currect link provided to your mail",
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
