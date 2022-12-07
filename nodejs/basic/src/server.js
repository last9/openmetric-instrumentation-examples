'use strict';

// Initialize express server
const express = require('express');
const app = express();
const port = 8765;

// Initialize prom client
const client = require('prom-client');

// Use prefix for app context
const prefix = 'basic_example_'

// Default Metrics are process metrics as recommended by Prometheus
// https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors
const collectDefaultMetrics = client.collectDefaultMetrics;

// Setup a new registry
const Registry = client.Registry;
const register = new Registry();

// Register the default metrics to the registry and attach a prefix
collectDefaultMetrics({register, prefix});

// Expose /metrics endpoint along with the process metrics registry
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

// Fire up the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}, metrics exposed on /metrics endpoint`);
});
