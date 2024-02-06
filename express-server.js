const express = require("express");
const fs = require("fs/promises");
const app = express();

app.get("/api/owners/:id", (req, res) => {
  if (req.params.id) {
    const id = Number(req.params.id);
    fs.readFile(`${__dirname}/data/owners/o${id}.json`, "utf8").then(
      (fileContent) => {
        const parseContent = JSON.parse(fileContent);
        res.status(200).send({ owner: parseContent });
      }
    );
  }
});
app.get("/api/owners", (req, res) => {
  let result = [];
  fs.readdir(`${__dirname}/data/owners`, "utf8").then((fileContent) => {
    Promise.all(
      fileContent.map((file) => {
        return fs.readFile(`${__dirname}/data/owners/${file}`, "utf8");
      })
    ).then((content) => {
      for (let i = 0; i < content.length; i++) {
        result.push(JSON.parse(content[i]));
      }
      res.status(200).send({ owners: result });
    });
  });
});
app.get("/api/owners/:id/pets", (req, res) => {
  let array = [];
  let result = [];
  fs.readdir(`${__dirname}/data/pets`, "utf8").then((fileContent) => {
    Promise.all(
      fileContent.map((file) => {
        return fs.readFile(`${__dirname}/data/pets/${file}`, "utf8");
      })
    ).then((content) => {
      for (let i = 0; i < content.length; i++) {
        array.push(JSON.parse(content[i]));
      }
      array.forEach((pet) => {
        if (pet.owner === `o${req.params.id}`) {
          result.push(pet);
        }
      });
      res.status(200).send({ ownerspets: result });
    });
  });
});
app.get("/api/pets", (req, res) => {
  console.log(req.query);
  let array = [];
  let result = []
  fs.readdir(`${__dirname}/data/pets`, "utf8").then((fileContent) => {
    Promise.all(
      fileContent.map((file) => {
        return fs.readFile(`${__dirname}/data/pets/${file}`, "utf8");
      })
    ).then((content) => {
      for (let i = 0; i < content.length; i++) {
        array.push(JSON.parse(content[i]));
      }
      array.forEach((pet) => {
        if (pet.temperament === req.query.temperament) {
          result.push(pet);
        }
      });
      res.status(200).send({pets: result})
    });
  });
});
app.get("/api/pets/:id", (req, res) => {
    const id = Number(req.params.id);
    fs.readFile(`${__dirname}/data/pets/p${id}.json`, "utf8").then(
        (fileContent) => {
          const parseContent = JSON.parse(fileContent);
          res.status(200).send({ owner: parseContent });
        }
      );
})

app.use(express.json());

app.post("/api/owners", (req, res) => {
  let result = [];
  fs.readdir(`${__dirname}/data/owners`, "utf8").then((fileContent) => {
    Promise.all(
      fileContent.map((file) => {
        return fs.readFile(`${__dirname}/data/owners/${file}`, "utf8");
      })
    ).then((content) => {
      for (let i = 0; i < content.length; i++) {
        result.push(JSON.parse(content[i]));
      }
      console.log(result);
    });
});
})
app.patch("/api/owner/:id", (req, res) => {
    const id = Number(req.params.id);
    fs.readFile(`${__dirname}/data/owners/o${id}.json`).then(content => {
        const currentObject = JSON.parse(content)
        const keysToChange = Object.keys(req.body)
        for(let i = 0; i < keysToChange.length; i++){
            currentObject[keysToChange[i]] = req.body[keysToChange[i]]
        }
        return currentObject
    }).then(result => {
        console.log(result);
        fs.writeFile(`${__dirname}/data/owners/o${id}.json`,JSON.stringify(result, null, 2),'utf8')
        res.status(200).send({changedOwner: result})
    })
});

app.delete("/api/", (req, res) => {
  
});

app.listen(9090, () => {
  console.log("Server is listening on port 9090");
});
