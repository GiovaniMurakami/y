const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

//DB Connection
const conn = require("./db/conn");

//Models
const Thought = require("./models/Thought");
const User = require("./models/User");

//Routes
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const authRoutes = require("./routes/authRoutes");

//Controllers
const ThoughtController = require("./controllers/ThoughtsController");

//Setting View Engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//Setting form reader
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
            path: require("path").join(require("os").tmpdir(), "sessions"),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        },
    })
);

app.use(flash());

app.use(express.static("public"));

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
});

app.use("/thoughts", thoughtsRoutes);
app.use("/", authRoutes);

app.get("/", ThoughtController.showThoughts);

conn.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
