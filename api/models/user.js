module.exports = function (sqlize, DataTypes) {
    const User = sqlize.define('users', {
        email: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING
        }
    })
    return User;
}