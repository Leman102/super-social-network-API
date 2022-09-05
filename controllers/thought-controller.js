const { Thought, User } = require('../models');

const thoughtController = {
    // Get all thoughts
    getThought(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(404).json(err));
    },
    // get single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then(dbThoughtData =>
                !dbThoughtData
                    ? res.status(404).json({ message: "No Thought find with this ID!" })
                    : res.json(dbThoughtData)
            )
            .catch(err => res.status(404).json(err));
    },
    //add thought to user
    createThought({ body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    //add data to an array
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
    //update a thought
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            body,
            { runValidators: true, new: true }
        )
        .then(dbThoughtData =>
            !dbThoughtData
                ? res.status(404).json({ message: "No thought find with this ID!" })
                : res.json(dbThoughtData)
        )
        .catch(err => res.json(err));
    },
    //delete a thought
    deleteThought({params}, res) {
      Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(dbThoughtData =>
            !dbThoughtData
                ? res.status(404).json({ message: "No thought find with this ID!" })
                : User.findByIdAndUpdate(
                    { _id: params.thoughtId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                )
        )
        .then(thoughtData =>
            !thoughtData
                ? res.status(404).json({ message: 'Thought deleted, but no user found'})
                : res.json({ message: 'Thought successfully deleted' })
        )
        .catch(err => res.json(err));
    },
    //create reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { runValidators: true, new: true }
        )
            .populate({ path: 'reactions', select: '-__v'})
            .select('-__v')
            .then(dbThoughtData =>
                !dbThoughtData
                    ? res.status(404).json({ message: "No thought find with this ID!" })
                    : res.json(dbThoughtData)
            )
            .catch(err => res.status(500).json(err));
    },
    //delete reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then(dbThoughtData =>
                !dbThoughtData
                    ? res.status(404).json({ message: "No thought find with this ID!" })
                    : res.json(dbThoughtData)
            )
            .catch((err) => res.status(500).json(err));
    }
};

module.exports = thoughtController;