'use strict'

// const util = require('util')
// const mysql = require('mysql')
const DB = require('./../databases/db')

module.exports = {
    getProvinces: (req, res) => {
        let sql = 'SELECT * FROM province'
        DB.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    getDistrictsOfProvince: (req, res) => {
        let sql = 'SELECT * FROM district WHERE _province_id = ?'
        DB.query(sql, [req.params.provinceId], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    getWardsOfDistrict: (req, res) => {
        let sql = 'SELECT * FROM ward WHERE _district_id = ?'
        DB.query(sql, [req.params.districtId], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
}