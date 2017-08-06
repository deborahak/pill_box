exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/pill_box';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost/pill_box_test";
exports.jwt_secret = 'SunnySandy*';
exports.PORT = process.env.PORT || 8080;