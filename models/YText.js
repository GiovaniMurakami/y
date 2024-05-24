const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const YText = db.define("YText", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
});

YText.belongsTo(User);
User.hasMany(YText);

module.exports = YText;
