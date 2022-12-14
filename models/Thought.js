const { Schema, model, Types } = require('mongoose');

// import moment module to format the timestamp 
const moment = require('moment')

//reaction schema
const ReactionSchema = new Schema (
    {
       reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
       },
       reactionBody: {
        type: String,
        required: true,
        maxlength: 280
       },
       username: {
        type: String,
        required: true,
       },
       createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
       },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    }
)

// thought schema
const ThoughtSchema = new Schema (
    {
      thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)


// get total count of reactions
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

// create the Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;