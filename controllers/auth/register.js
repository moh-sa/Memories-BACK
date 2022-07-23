import { userModel } from "../../models/index.js";

/**
 *
 * @param req.body.data - Obj contain all the sent data from the front .
 * @UserDB - expect:  username, password, email.
 * @return - obj contain statusCode, message, from
 */
export default async function (req, res) {
  const userData = req.body;

  try {
    const newUser = await userModel.create(userData);

    await newUser.save();

    res.status(201).json({
      statusCode: 201,
      from: "controllers/auth/register 2",
      message:
        "You have been successfully registered. Please check your email to activate the account.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(503).json({
      statusCode: 503,
      from: "controllers/auth/register 3",
      message: "Something went wrong. Please try again.",
    });
  }
}