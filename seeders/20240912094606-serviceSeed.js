"use strict";
const { v4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Services", [
      {
        id: v4(),
        name: "Servis CVT",
        description:
          "Servis untuk membersihkan dan melumasi bagian CVT motor matic.",
        cost: 150000,
        estimate: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        name: "Ganti Oli Mesin",
        description: "Penggantian oli mesin untuk menjaga performa motor.",
        cost: 75000,
        estimate: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        name: "Servis Rem",
        description: "Pemeriksaan dan perbaikan rem depan dan belakang motor.",
        cost: 50000,
        estimate: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        name: "Ganti Kampas Rem",
        description:
          "Penggantian kampas rem untuk meningkatkan daya cengkeram rem.",
        cost: 85000,
        estimate: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        name: "Tune-Up Mesin",
        description:
          "Perawatan menyeluruh mesin untuk meningkatkan performa motor.",
        cost: 200000,
        estimate: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Services", null, {});
  },
};
