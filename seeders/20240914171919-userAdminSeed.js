"use strict";
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password
    const salt = await bcrypt.genSaltSync(10);
    // Get id admin from "roles" table
    const adminId = await queryInterface.rawSelect(
      "roles",
      {
        where: { name: "admin" },
      },
      ["id"]
    );

    await queryInterface.bulkInsert("users", [
      {
        id: v4(),
        username: "admin",
        address: "Indonesia",
        phoneNumber: "082232328196",
        password: bcrypt.hashSync("admin123", salt),
        role_id: adminId,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
  },
};
