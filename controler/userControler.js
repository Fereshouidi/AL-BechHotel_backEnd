import User from "../models/user.js";

export const addUser = async(req, res) => {

    const { userData } = req.body;
    
    try {
        const newUser = await new User(userData);
        newUser.save();
        console.log(newUser);
        res.status(201).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const updateUser = async (id, userData, req, res) => {

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!userData || Object.keys(userData).length === 0) {
        return res.status(400).json({ error: 'User data is required for update' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: userData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Updated user:', updatedUser);
        return updatedUser;
        
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = async () => {

    try {
        const allUsers = await User.find();
        return allUsers;
    } catch (err) {
        return err;
    }

}


export const updateUsers = async (updatedUsers) => {

    try {
        
        if (Array.isArray(updatedUsers) && updatedUsers.length > 0) {
            await Promise.all(
                updatedUsers.map(user =>
                    User.findOneAndUpdate({ _id: user._id }, { ...user })
                )
            );
        }
        return 'the rooms has been updated successfully';

    } catch (err) {
        console.log(err);
        return err;
    }

}
