const fs = require('fs/promises')
const retrieveAllOwners = () => {
    let result = [];
    return fs.readdir(`${__dirname}/data/owners`, "utf8").then((fileContent) => {
      return Promise.all(
        fileContent.map((file) => {
          return fs.readFile(`${__dirname}/data/owners/${file}`, "utf8");
        })
      )
    }).then((content) => {
        for (let i = 0; i < content.length; i++) {
          result.push(JSON.parse(content[i]));
        }
        console.log(result);
        return result
      });
  }
const retreiveAllPetsbyId = (id) => {
    let array = [];
    let result = [];
    return fs.readdir(`${__dirname}/data/pets`, "utf8").then((fileContent) => {
     return Promise.all(
        fileContent.map((file) => {
          return fs.readFile(`${__dirname}/data/pets/${file}`, "utf8");
        })
      )
    }).then((content) => {
      for (let i = 0; i < content.length; i++) {
        array.push(JSON.parse(content[i]));
      }
      array.forEach((pet) => {
        if (pet.owner === `o${id}`) {
          result.push(pet);
        }
      });
      console.log(result);
      return result
    });
  }
const deletePetsAndOwner = (owner) => {
    const idOfOwner = owner.id;
    return fs.readFile(`${__dirname}/data/owners/${idOfOwner}.json`, "utf8")
      .then((file) => {
        const owner = JSON.parse(file);
        fs.unlink(`${__dirname}/data/owners/${idOfOwner}.json`);
        return fs.readdir(`${__dirname}/data/pets`, "utf-8");
      })
      .then((files) => {
          const array =[]
          files.forEach((file) => {
            array.push(fs.readFile(`${__dirname}/data/pets/${file}`,'utf8'));
          })
        return Promise.all(array)
      })
      .then((contents) => {
        petsToDelete = []
        for(let i = 0; i < contents.length; i ++){
          const pet = JSON.parse(contents[i]);
          const id = pet.owner
        if (id === `${idOfOwner}`) {
            petsToDelete.push(pet);
            fs.unlink(
                `${__dirname}/data/pets/${pet.id}.json`
            );
        }
      }
      console.log(petsToDelete);
        return petsToDelete
      })
  }
const getOwnerbyId = (id) => { 
  const numId = Number(id);
    return fs.readFile(`${__dirname}/data/owners/o${id}.json`, "utf8").then(
      (fileContent) => {
        const parseContent = JSON.parse(fileContent);
        return parseContent
      }
    )
}
const deletePetById = (id) => {
    const idOfPet = id;
    return fs.readFile(`${__dirname}/data/pets/p${idOfPet}.json`, "utf8")
      .then((file) => {
        pet = JSON.parse(file)
        fs.unlink(`${__dirname}/data/pets/p${idOfPet}.json`)
        return pet
      })
      .catch((err) => {

        return {msg: 'No pet for this id'}
      });
  
}
module.exports = {retrieveAllOwners, retreiveAllPetsbyId,deletePetsAndOwner, getOwnerbyId,deletePetById}