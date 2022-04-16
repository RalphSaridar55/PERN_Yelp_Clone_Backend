const db = require('../db');
const { formValidator } = require('../helpers/validator');





async function getRestaurants(req, res) {
    const results = await db.query("SELECT * FROM restaurants");

    let data = {
        status: true,
        message: "retrieved all restaurants",
        data: results.rows,
        length: results.rows.length
    }

    res.status(201).send(data);
};





async function getRestaurant(req, res) {
    const result = await db.query('SELECT * FROM restaurants WHERE id=$1', [
        req.params.id
    ]);

    let data = {
        status: true,
        message: `retrieved restaurant #${req.params.id}`,
        data: result.rows[0],
        length: result.rows.length
    }

    res.status(201).send(data);
};





async function updateRestaurants(req, res) {
    res.status(201).send({ message: 'successfully updated' })
}

async function createRestaurants(req, res) {
    let result = await formValidator('restaurant', req.body)
    if (result.length > 0) {
        res.status(400).send({ error: result })
    }
    else {
        //check if unique
        const check = await db.query("SELECT COUNT(name) FROM restaurants WHERE name=$1", [
            req.body.name
        ])
        console.log("CHECK, ",check)
        if (check.rows[0].count == '1') {
            res.status(400).send({ error: 'Restaurant already exists' })
        }
        else {
            try {
                const results = await db.query("INSERT INTO restaurants (name, location, price_range) VALUES($1,$2,$3)", [
                    req.body.name,
                    req.body.location,
                    req.body.price_range,
                ])
                
                let data = {
                    status: true,
                    message: `created restaurant`,
                    data: req.body,
                    length: results.rows.length
                }

                res.status(201).send(data)
            }
            catch (err) {
                console.log(err)
                res.status(500).send({ message: "Something went wrong from the server side" })
            }
        }
    }
}





async function deleteRestaurants(req, res) {
    res.status(201).send({ message: 'successfully deleted' })
}

module.exports = {
    getRestaurants,
    getRestaurant,
    updateRestaurants,
    createRestaurants,
    deleteRestaurants
}