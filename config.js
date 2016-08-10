module.exports = function(app, express) {

    app.db = {};
    if (process.env.MONGOHQ_URL) {
        app.mongoose.connect(process.env.MONGOHQ_URL);
    } else {
        app.mongoose.connect('mongodb://localhost:27017/cyza');

        app.db.user = app.mongoose.model('User', {
            firstName: String,
            id_linkedin: String,
            lastName: String,
            email :String,
            password: String,
            pictureUrl: String,
            about: String,
            publicProfileUrl: String,
            address: String,
            company: String,
            token: String
        });

        /*
        app.Todo = app.mongoose.model('Todo', {
            text: String
        });
        app.Menu = app.mongoose.model('Menu', {
            text: String,
            link: String
        });*/
    }

    app.lang.configure({
        locales: ['es'],
        defaultLocale: 'es',
        directory: __dirname + '/locales'
    });
    app.lang.setLocale('es');
    app.use(app.lang.init);


    app.use(app.bodyParser.urlencoded({ extended: true }));
    app.use(app.bodyParser.json());
    app.use(app.cookieParser());
    app.enable('trust proxy');
    var session = require('express-session');
    app.engine('html', require('ejs').renderFile);

    app.set('view engine', 'html');
    app.set('views', __dirname + '/www');


    app.use(app.methodOverride());
    app.use('/assets', express.static(app.path.resolve('www', 'assets')));
    app.use('/lib', express.static(app.path.resolve('www', 'lib')));
    app.use('/app', express.static(app.path.resolve('www', 'app')));
    app.use(express.static(app.path.join(__dirname, '/www')));

    app.use(app.passport.initialize());
};
