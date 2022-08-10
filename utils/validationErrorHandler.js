exports.validateData = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return res.status(400).send(errors);
  } else {
    return res.status(500).send("Something went wrong, Please try again later");
  }
};
