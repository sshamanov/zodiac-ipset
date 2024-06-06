const express = require('express');
const { exec } = require("child_process");

const app = express ();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });

app.get("/list", (request, response) => {

    exec("sudo ipset list -output xml| xq .|jq", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);

        try {
            const jsonResult = JSON.parse(stdout);
            response.json(jsonResult);
        } catch (parseError) {
            console.error(`Error parsing JSON: ${parseError.message}`);
            response.status(500).json({ error: 'Error parsing JSON' });
        }

    });
 });