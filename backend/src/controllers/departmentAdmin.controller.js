export const testApi = async (req, res) => {
  try {
    console.log("hello world");
    return res.status(200).json({
      message: "Working properly have a nice dat",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
