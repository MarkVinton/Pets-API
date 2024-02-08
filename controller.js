const {retrieveAllOwners, retreiveAllPetsbyId, getOwnerbyId, deletePetsAndOwner, deletePetById} = require('./model')



const getAllOwners = (req,res) =>{
retrieveAllOwners().then((results) => {
    console.log(results);
    res.status(200).send(results)
})
}
const getOwnersPets = (req,res) => {
  retreiveAllPetsbyId(req.params.id).then(results => {
  res.status(200).send(results)
  })
}
const deleteOwnerWithPets = (req,res) => {
  getOwnerbyId(req.params.id).then(result => {
    deletePetsAndOwner(result).then(pets => {
      res.status(200).send({deletedOwner: result, deletedPets: pets})
    })
  })
}
const getOwnerwithId = (req,res) => {
  getOwnerbyId(req.params.id).then(result => {
    res.status(200).send(result)
  })
}
const deletePetWithId = (req,res) => {
  deletePetById(req.params.id).then(pet => {
    res.status(200).send({deletedPets: pet})
  })
}

  module.exports = {getAllOwners, getOwnersPets, deleteOwnerWithPets,getOwnerwithId,deletePetWithId}