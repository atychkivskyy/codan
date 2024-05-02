const {queryApi, bucket} = require('../config/influxdb');

exports.queryMetrics = async (req, res) => {
    const {field, time} = req.query;
    if (!/^[\w]+$/.test(field) || !/^[1-9][0-9]*[mshd]$/i.test(time)) {
        return res.status(400).send('Invalid field or time range format');
    }
    const fluxQuery = `from(bucket: "${bucket}")
        |> range(start: -${time}, stop: now())
        |> filter(fn: (r) => r["_measurement"] == "sensor_data")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> filter(fn: (r) => r["sensor_id"] == "1" or r["sensor_id"] == "2" or r["sensor_id"] == "3" or r["sensor_id"] == "4" or r["sensor_id"] == "5")`;

    try {
        const rows = [];
        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                rows.push(o);
            },
            error(error) {
                res.status(500).send(`Error querying data: ${error}`);
            },
            complete() {
                res.json(rows);
            },
        });
    } catch (error) {
        res.status(500).send(`Failed to query data: ${error.message}`);
    }
};
