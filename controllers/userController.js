const bcryptjs = require("bcrypt");
const userService = require("../services/userServices");

exports.register = (req, res, next)=>{
    const {password}= req.body;
    const salt = bcryptjs.genSaltSync(10);

    req.body.password = bcryptjs.hashSync(password, salt);

    userService.register(req.body, (error, result)=>{
        if(error){
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: result,
        });
    });
};

exports.login = (req, res, next)=>{
    const {userName, password}= req.body;

    userService.login({userName, password},(error, result)=>{
        if(error){
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: result,
        });
    });
};

// exports.userProfile= (req, res, next)=>{
//     return res.status(200).json({message:"Authorized User!"});
// };

exports.userProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId, { username: 1, email: 1 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            message: "Authorized user",
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
