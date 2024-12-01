const express = require("express")
const Connect = require("./config/db")
const Cors = require("cors")

const app = express();
app.use(Cors())
app.use(express.json())

const port = process.env.PORT || 4000

Connect();

app.use('/', require('./Router/route'));


app.listen(port,()=>{
  console.log('connected to a port')}
)


// app.get('/', (req, res) => {
//   res.send("workingss")
//   console.log("working")
// })

// const newUser = new User({
//   name: 'firafis',
//   email: 'fira@gmail.com',
//   password: 'ffffff',
// });

// newUser.save()
//   .then(() => console.log('User saved'))
//   .catch(err => console.error(err));

// async function getUsers() {
//   try {
//     // Find all users
//     const users = await User.find();
//     console.log('Users:', users);
//   } catch (error) {
//     console.error('Error reading users:', error);
//   }
// }
  
// Call the function
// getUsers();

// async function getUserByEmail(email) {
//   try {
//     const user = await User.findOne({ email });
//     console.log('User found:', user);
//   } catch (error) {
//     console.error('Error finding user:', error);
//   }
// }

// Call the function with a specific email
// getUserByEmail('fira@gmail.com');

// async function update(email,Newname) {
//   try{
//     const result = await User.updateOne({ email }, {$set: {name: Newname}})
//     console.log("The document updated successfully( ", result, ")")
//   } catch(error){
//   console.log("Error: " + " error")
// }
// }

// update("fira@gmail.com","Beka")

// Delete multiple users by a condition
// async function deleteUsersByCondition(condition) {
//   try {
//     // Delete many users that match the condition
//     const result = await User.deleteMany(condition);
//     console.log('Delete result:', result);
//   } catch (error) {
//     console.error('Error deleting users:', error);
//   }
// }

// Call the function with a specific condition
// deleteUsersByCondition({ name: 'Beka' });


