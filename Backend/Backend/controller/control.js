const User = require("../models/user")

const signup = async (res,req) => {
    const { name, email, password } = req.body;

    const userExist = User.findOne({email})

    if(userExist){
        return res.status(201).json({ message: 'User Already exists' });
    }
  
    try {
      const newUser = new User({ name, email, password });
      await newUser.save();
      return res.status(201).json({ message: 'User Registered successfully' });
      
    } catch (err) {
      return res.status(400).json({ message: 'Failed to Registered', error: err });
    }
}

module.exports = signup
