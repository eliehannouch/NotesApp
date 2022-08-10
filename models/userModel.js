const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your fullName"],
      trim: true,
      minLength: 5,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid email");
        }
      },
    },

    password: {
      type: String,
      required: [
        true,
        "Please enter your password - with a length of at least 8 characters",
      ],
      trim: true,
      minLength: 8,
      validate(value) {
        if (!validator.isLength(value, { min: 8 })) {
          throw new Error(
            "Please enter a password with a length of at least 8 characters "
          );
        }
      },
    },
    passwordConfirm: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },

    ownedNotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userModel.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  } catch (err) {
    console.log(err);
  }
});

userModel.methods.checkPassword = async function (
  candidatePassword, // inside form
  userPassword // inside DB
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userModel);
