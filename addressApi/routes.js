'use strict';
module.exports = function(app) {
    let mainController = require('./controllers/mainController');

    app.route('/api/v1/provinces').get(mainController.getProvinces)

    app.route('/api/v1/districts/:provinceId').get(mainController.getDistrictsOfProvince)

    app.route('/api/v1/wards/:districtId').get(mainController.getWardsOfDistrict)
};