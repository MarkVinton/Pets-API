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
                if (pet.temperament === req.query.temperament) {
                    result.push(pet);
                }
            });
            res.status(200).send({ pets: result });
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
});

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
            let newId = `o${Date.now()}`;
            req.body.id = newId;
            if (
                Object.keys(req.body).includes("id") &&
                Object.keys(req.body).includes("name") &&
                Object.keys(req.body).includes("age")
            ) {
                fs.writeFile(
                    `${__dirname}/data/owners/${newId}.json`,
                    JSON.stringify(req.body, null, 2),
                    "utf8"
                );
                res.status(200).send({ newOwner: req.body });
            } else {
                res.status(400).send({
                    msg: "request does not contain correct information",
                });
            }
        });
    });
});
app.patch("/api/owner/:id", (req, res) => {
    const id = Number(req.params.id);
    fs.readFile(`${__dirname}/data/owners/o${id}.json`)
        .then((content) => {
            const currentObject = JSON.parse(content);
            const keysToChange = Object.keys(req.body);
            for (let i = 0; i < keysToChange.length; i++) {
                currentObject[keysToChange[i]] = req.body[keysToChange[i]];
            }
            return currentObject;
        })
        .then((result) => {
            console.log(result);
            fs.writeFile(
                `${__dirname}/data/owners/o${id}.json`,
                JSON.stringify(result, null, 2),
                "utf8"
            );
            res.status(200).send({ changedOwner: result });
        });
});

app.post("/api/owners/:id/pets", (req, res) => {
    const pet = {
        id: null,
        name: null,
        avatarUrl: null,
        favouriteFood: null,
        owner: null,
        age: null,
        temperament: null,
    };
    fs.readdir(`${__dirname}/data/owners`).then((contents) => {
        if (contents.includes(`o${req.params.id}.json`)) {
            const id = `p${Date.now()}`;
            req.body.owner = `o${req.params.id}`;
            req.body.id = id;
            const reqObjProps = Object.keys(req.body);
            const includesAllProps = Object.keys(pet)
                .map((prop) => reqObjProps.includes(prop))
                .reduce((acc, curr) => acc && curr, true);
            const isAPet =
                includesAllProps &&
                reqObjProps.length === Object.keys(pet).length;
            if (isAPet) {
                fs.writeFile(
                    `${__dirname}/data/pets/${id}.json`,
                    JSON.stringify(req.body, null, 2),
                    "utf8"
                );
                res.status(201).send({ pet: req.body });
            } else {
                res.status(400).send({ msg: "Bad request. Invalid Pet." });
            }
        } else {
            res.status(404).send({ msg: "Owner not found." });
        }
    });
});

app.delete("/api/pets/:id", (req, res) => {
    const idOfPet = req.params.id;
    fs.readFile(`${__dirname}/data/pets/p${idOfPet}.json`, "utf8")
        .then((file) => {
            fs.unlink(`${__dirname}/data/pets/p${idOfPet}.json`).then(
                (result) => res.status(200).send({ pet: JSON.parse(file) })
            );
        })
        .catch((err) => {
            res.status(400).send({
                msg: "Bad request. No pet with the id",
            });
        });
});

app.delete("/api/owners/:id", (req, res) => {
    const idOfOwner = req.params.id;
    fs.readFile(`${__dirname}/data/owners/o${idOfOwner}.json`, "utf8")
        .then((file) => {
            const owner = JSON.parse(file);
            fs.unlink(`${__dirname}/data/owners/o${idOfOwner}.json`);
            return fs.readdir(`${__dirname}/data/pets`, "utf-8");
        })
        .then((files) => {
            const petsToDelete = Promise.all(
                files.map((file) => {
                    return fs.readFile(`${__dirname}/data/pets/${file}`);
                })
            );
            return [owner, petsToDelete];
        })
        .then((result) =>
            res.status(200).send({ owner: result[0], pets: result[1] })
        )
        .catch((err) => {
            res.status(400).send({
                msg: "Bad request. No owner with the id",
            });
        });
});

app.listen(9090, () => {
    console.log("Server is listening on port 9090");
});

// .then((contents) => {
//   const parsedContents = JSON.parse(contents);
//   console.log(parsedContents.owner);
//   if (parsedContents.owner === `o${idOfOwner}`) {
//       petsToDelete.push(parsedContents);
//       fs.unlink(
//           `${__dirname}/data/pets/${parsedContents.id}.json`
//       );
//   }
// });
