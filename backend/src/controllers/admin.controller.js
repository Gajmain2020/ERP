function logOutError(error) {
  console.log("ERORR :: ");
  console.log(error);
  console.log(
    "________________________________________________________________"
  );
  console.log(error.message);
}

export const signUpAdmin = async (req, res) => {
  try {
    console.log(req.body);
    console.log("this is admin signup api endpoint");
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    console.log(req.body);
    console.log("This is admin login api end point");
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
