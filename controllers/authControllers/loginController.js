const User = require("../../models/userModel");
const jwt = require("../../utils/jwtCreator");
const errorHandler = require("../../utils/validationErrorHandler").validateData;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.checkPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    jwt.createSendToken(user, 200, res);
  } catch (error) {
    errorHandler(res, error);
  }
};
