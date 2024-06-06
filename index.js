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

 app.post('/add', (req, res) => {
    const { list, ips } = req.body;
    
    console.log(JSON.stringify(req.body));

    if (!list || !Array.isArray(ips)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
  
    let results = [];
    let errors = [];
    let completed = 0;
  
    ips.forEach(ip => {
      const command = `sudo ipset del HW ${ip}; sudo ipset del BP ${ip}; sudo ipset add ${list} ${ip}`;
  
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          errors.push({ ips: ip, error: error ? error.message : stderr });
        } else {
          try {
            results.push({ ips: ip, result: JSON.parse(stdout) });
          } catch (parseError) {
            errors.push({ ips: ip, error: 'Error parsing JSON' });
          }
        }
  
        completed++;
        if (completed === ips.length) {
          if (errors.length > 0) {
            res.status(500).json({ errors, results });
          } else {
            res.json(results);
          }
        }
      });
    });
  });