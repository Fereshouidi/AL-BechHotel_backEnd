import Booking from "../models/booking";

export const handleAddBooking = async (req, res) => {
    const { bookingData } = req.body;
    const newBooking = await addBooking(bookingData);
    res.status(201).json({newBooking});
}



export const addBooking = async (bookingData) => {

    try {
        const newBooking = await new Booking(bookingData);
        await newBooking.save();
        return newBooking;

    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }

}