const YText = require("../models/YText");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class YController {
    static async showYs(req, res) {
        let search = "";
        if (req.query.search) {
            search = req.query.search;
        }

        let order = "DESC";

        if (req.query.order === "old") {
            order = "ASC";
        } else {
            order = "DESC";
        }

        const YData = await YText.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` },
            },
            order: [["createdAt", order]],
        });
        const Ys = YData.map((r) => r.get({ plain: true }));

        let YsQty = Ys.length;
        if (YsQty === 0) {
            YsQty = false;
        }

        res.render("Ys/home", { Ys, search, YsQty });
    }

    static async dashboard(req, res) {
        const userId = req.session.userid;
        const user = await User.findOne({
            where: { id: userId },
            include: YText,
            plain: true,
        });
        if (!user) {
            res.redirect("/login");
        }
        const Ys = user.YTexts ? user.YTexts.map((r) => r.dataValues) : [];
        res.render("Ys/dashboard", { Ys });
    }

    static createY(req, res) {
        res.render("Ys/create");
    }

    static async createYPost(req, res) {
        const Y = {
            title: req.body.title,
            UserId: req.session.userid,
        };
        try {
            await YText.create(Y);
            req.flash("message", "Y criado com sucesso");
            req.session.save(() => {
                res.redirect("/Ys/dashboard");
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async removeY(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid;
        try {
            await YText.destroy({ where: { id: id, UserId: UserId } });
            req.flash("message", "Y excluído com sucesso!");
            req.session.save(() => {
                res.redirect("/Ys/dashboard");
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async editY(req, res) {
        const id = req.params.id;
        const Y = await YText.findOne({ where: { id: id }, raw: true });

        if (!Y || req.session.userid != Y.UserId) {
            req.flash("message", "Erro, não foi possível exibir esse Y");
            YController.showYs(req, res);
            return;
        }
        res.render("Ys/edit", { Y });
    }

    static async editYSave(req, res) {
        const id = req.body.id;
        const Y = {
            title: req.body.title,
        };
        try {
            await YText.update(Y, { where: { id: id } });
            req.flash("message", "Y atualizado com sucesso!");
            req.session.save(() => {
                res.redirect("/Ys/dashboard");
            });
        } catch (e) {
            console.log(e);
        }
    }
};
