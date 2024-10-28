import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import { Item } from "../../models/Item.js";
import { Look } from "../../models/Look.js";
import { notificationService } from "../../api/service/notificationService.js";
import { Op } from "sequelize";


export const userResolver = {
  async getUser(args, req) {
    if (!req.isAuth) {
      throw new Error("Unauthorized!");
    }
    return await User.findOne({
      where: { _id: req.userId },
      include: [
        Item,
        Look,
        "friends",
        "followers",
        "followed"],
    });
  },

  async getProfileByName(args, req) {
    return await User.findOne({
      where: { userName: args.userName },
      include: [
        {
          model: Item,
          required: false,
          where: {
            active: true,
            status: "S0",
            private: {
              [Op.or]: [false, null],
            },
          },
        },
        {
          model: Look,
          required: false,
          where: {
            active: true,
            private: {
              [Op.or]: [false, null],
            },
          },
        },
        "friends",
        "followers",
        "followed",
      ],
    });
  },

  async getProfileById(args, req) {
    return await User.findOne({
      where: { _id: args._id },
      include: [
        {
          model: Item,
          required: false,
          where: {
            active: true,
            status: "S0",
            private: {
              [Op.or]: [false, null],
            },
          },
        },
        {
          model: Look,
          required: false,
          where: {
            active: true,
            private: {
              [Op.or]: [false, null],
            },
          },
        },
        "followers",
        "followed",
      ],
    });
  },

  // addUser(userInput: UserInputData!): User!
  async addUser(args, req) {
    const foundUserEmail = await User.findOne({
      where: {
        email: args.userInput.email,
      },
    });
    if (foundUserEmail) {
      throw new Error("This email is already associated with an account.");
    }
    const foundUserUserName = await User.findOne({
      where: {
        userName: args.userInput.userName.toLowerCase(),
      },
    });
    if (foundUserUserName) {
      throw new Error("This username is already associated with an account.");
    }
    try {
      hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        userName: args.userInput.userName.toLowerCase(),
        language: args.userInput.language,
        email: args.userInput.email,
        password: hashedPassword,
        lastActive: Date.now(),
      });
      return await user.save();
    } catch (err) {
      console.log(err);
    }
  },

  // updateUser(_id: ID!, userInput: UserInputData!): User!
  async updateUser(args, req) {
    if (!req.isAuth) {
      throw new Error("Unauthorized!");
    }
    const updateFields = [];
    const updatableFields = [
      "avatar",
      "userName",
      "emailSettings",
      "profilSettings",
      "language",
      "gender",
      "archived",
      "usernameChange",
    ];
    updatableFields.forEach((field) => {
      if (field in args.userInput) {
        updateFields[field] = args.userInput[field];
      }
    });
    if (args.userInput.password) {
      updateFields.password = await bcrypt.hash(args.userInput.password, 12);
    }
    try {
      const updatedUser = await User.update(updateFields, {
        where: {
          _id: req.userId,
        },
        returning: true,
        plain: true,
      });
      //if avatar as updated, create notification
      if (args.userInput.avatar) {
        await notificationService.createNotificationBasic(req.userId, args.userInput.avatar, 14, req.userId)
      };
      // updatedUser[0]: number or row udpated
      // updatedUser[1]: rows updated
      return updatedUser[1];
    } catch (err) {
      console.log(err);
    }
  },

  // deleteUser: Boolean!
  async deleteUser(args, req) {
    if (!req.isAuth) {
      throw new Error("Unauthorized!");
    }
    await User.destroy({
      where: {
        _id: req.userId,
      },
    });
    req.session = null;
    return true;
  },
};
