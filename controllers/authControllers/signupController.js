const User = require("../../models/userModel");
const jwt = require("../../utils/jwtCreator");
const sendEmail = require("../../utils/emailHandler").sendEmail;
const errorHandler = require("../../utils/validationErrorHandler").validateData;

exports.signup = async (req, res) => {
  try {
    const email = await User.findOne({ email: req.body.email });

    if (email) {
      return res
        .status(409)
        .json({ message: "The email address is already in use" });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: "Passwords does not match" });
    }

    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    jwt.createSendToken(newUser, 201, res);

    await sendEmail({
      email: newUser.email,
      subject: "Welcome on board",
      message: `Dear ${newUser.fullName}, we are so happy to have you on board. Our team is wishing you a productive journey.`,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
