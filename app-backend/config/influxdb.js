const {InfluxDB} = require('@influxdata/influxdb-client');

require('dotenv').config();

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const url = process.env.INFLUX_URL;

const client = new InfluxDB({url, token});
const queryApi = client.getQueryApi(org);

module.exports = {queryApi, bucket};
