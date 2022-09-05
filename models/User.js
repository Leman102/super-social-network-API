const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              'Please use a valid email address ＠',
            ],

        },
        thoughts:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends:[
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        //enable virtuals 
        toJSON:{
            virtuals: true
        },
        id: false
    }
);

//Adding virtual
UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

//create User Model
const User = model('User', UserSchema);

module.exports = User;
