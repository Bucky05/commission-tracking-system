const jwt = require('jsonwebtoken');
const { secret }  = require('../configs/jwtConfig') 
function sign(id,role) {
    return jwt.sign(
      { id: id, role: role },
      secret,
      { expiresIn: '1d' }
    );

}

function verify(token) {
    return jwt.verify(token, secret);
}

module.exports = {
    sign,
    verify
}