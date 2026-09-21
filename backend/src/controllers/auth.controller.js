import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";

/**
 * @description Register an user and save the data from req.body
 * @param req express.Request
 * @param req.body Object
 * @param req.body.email String
 * @param req.body.name String
 * @param req.body.password String
 */

export const register = async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists with this email address",
      errors: [
        {
          field: "email",
          message: "User already exists with this email address",
        },
      ],
    });
  }

  const user = await userModel.create({
    email,
    name,
    passwordHash: await bcrypt.hash(password, 12),
  });

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  await userModel.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  res.status(200).json({
    message: "User are register Successfully",
    data: {
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    },
  });
};

/**
 * @description Login a user and create new set of accessToken and refreshToken
 * @param req.body.email String
 * @param req.body.password String
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "invalid email and password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = createAccessToken({ userId: user._id, role: user.role });
  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  await userModel.findOneAndUpdate(
    {
      email,
    },
    {
      refreshToken,
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  res.status(200).json({
    message: "user login successfully",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },

      accessToken,
    },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookie.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required.",
    });
  }

  try {
    const decode = readRefreshToken(refreshToken);

    const { userId, role } = decode;

    const user = await userModel.findById(userId);

    if (refreshToken != user.refreshToken) {
      await userModel.findByIdAndDelete(user._id, {
        refreshToken: null,
      });

      return req.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const accessToken = createAccessToken({ userId, role });
    const refreshToken = createRefreshToken({ userId, role });

    await userModel.findByIdAndUpdate(userId, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    res.status(200).json({
      message: "Tokens rotated successfully.",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh Token",
    });
  }
};
