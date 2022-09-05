const { User, Thought } = require('../models');

const userController = {
    // the functions will go in here as methods
    //get all Users
    getAllUser(req, res) {
        User.find({})
        //passing in an object with the key path
        //plus the value of the field you want populated. 
            .populate({
                path: 'thoughts',
                //don't need the __v field
                select: '-__v'
            })
            .select('-__v')
            //sort in desc order
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //get one User by ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                //if no User is found, send 404
                if(!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //create User
    createUser({ body }, res){
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    //update User by ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    //delete User
    deleteUser({ params }, res){
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData =>
                !dbUserData
                    ? res.status(404).json({ message: "No User find with this ID!" })
                    : Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
            )
            .then(() => res.json({ message: "User and Thought deleted!" }))
            .catch((err) => res.status(500).json(err));
    },
      //add a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { runValidators: true, new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },
    //delete a friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    }
};

module.exports = userController;


