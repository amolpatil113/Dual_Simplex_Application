const { getDb } = require('../models/index');

exports.renderHome = async (req, res) => {
    res.render('index', { title: 'Dual Simplex Airline - Home' });
};

exports.renderSimulate = async (req, res) => {
    try {
        const db = await getDb();
        const workers = await db.all('SELECT * FROM Workers');
        const flights = await db.all('SELECT * FROM Flights');

        res.render('simulate', { 
            title: 'Simulate - Live Cost Planning',
            workers,
            flights
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
};

exports.renderResults = async (req, res) => {
    res.render('results', { title: 'Optimization Results' });
};
