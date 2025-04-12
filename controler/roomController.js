import Room from "../models/room.js";

export const handleAddRoom = async (req, res) => {
    const { roomData } = req.body;
    console.log(roomData);
    
    const newRoom = await addRoom(roomData);
    res.status(201).json({newRoom});
}

export const addRoom = async (roomData) => {

    try {
        const newRoom = await new Room(roomData);
        await newRoom.save();
        return newRoom;

    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }

}

export const getAllRooms = async () => {
    
    try {
        const allRooms = await Room.find();
        return allRooms
    } catch (err) {
        return err
    }

}


export const updateRooms = async (updatedRooms) => {

    try {
        
        if (Array.isArray(updatedRooms) && updatedRooms.length > 0) {
            await Promise.all(
                updatedRooms.map(room =>
                    Room.findOneAndUpdate({ _id: room._id }, { ...room })
                )
            );
        }

        return 'the rooms has been updated successfully';

    } catch (err) {
        console.log(err);
        return err
    }

}