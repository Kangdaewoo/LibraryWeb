var Customer = require('../../model/customer');
var jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function(req, res) {
        const secret = req.app.get('superSecret');

        const issueToken = function(customer) {
            if (!customer) {
                throw new Error('Who are you?');
            } else {
                req.session.name = customer.name;
                req.session.transactions = customer.transactions;
                jwt.sign({
                        username: customer.logins.username, 
                        isAdmin: customer.logins.isAdmin
                    }, 
                    secret,
                    {expiresIn: 1440},
                    (err, token) => {
                        if (err) {
                            throw new Error('Failed to generate a token.');
                        }
                        return res.json({
                            success: true,
                            message: 'Welcome!',
                            token: token
                        });
                    }
                );
            }
        };

        const query = {
            username: req.body.username, 
            password: req.body.password};
        Customer.findCustomer(query).then(issueToken).catch(err => {
            return res.json({success: false, message: err.message});
        });
    },

    authenticated: function(req, res, next) {
        const token = req.body.token || req.query.token;
        if (token) {
            jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Where did you get this token?'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'Where is your token?'
            });
        }
    }
};