import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if hotel already exists for this owner
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    // Create hotel
    const hotel = await Hotel.create({ name, address, contact, city, owner });

    // Update user role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    return res.json({
      success: true,
      message: "Hotel Registered Successfully",
      hotel,
    });

  } catch (error) {
    console.error("Error registering hotel:", error);
    return res.json({ success: false, message: error.message });
  }
};
