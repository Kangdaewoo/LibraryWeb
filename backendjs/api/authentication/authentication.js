var Customer = require('../../model/customer');
var jwt = require('jsonwebtoken');

module.exports = {
    authentificate: function(req, res) {
        const secret = req.app.get('superSecret');

        const issueToken = function(customer) {
            if (!customer) {
                return res.json({
                    success: false,
                    message: 'Who are you?'
                });
            } else {
                jwt.sign(
                    {username: customer.username, isAdmin: customer.isAdmin}, 
                    secret,
                    {expiresIn: 1440},
                    (err, token) => {
                        if (err) {
                            return res.json({success: false, message: 'Failed to generate token.'});
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

        const onError = function(err) {
            res.status(403).json({message: err.message});
        }

        Customer.findCustomer(req.body).then(issueToken).catch(onError);
    },

    authentificated: function(req, res, next) {
        const token = req.body.token || req.query.token;
        if (token) {
            jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
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