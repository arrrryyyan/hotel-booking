import User from ".../models/User.js";
import {Webhook} from "svix";

const clerkWebhooks = async(req,res) =>{
     try {
        // Create a svix instance using clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        // Getting headers
        const headers = {
            "svix-id":req.headers["svix-id"],
            "svix-timestamps":req.headers["svix-timestamps"],
            "svix-signature":req.headers["svix-signature"],
        };
        // Verifying headers

        await whook.verify(JSON.stringify(req.body), headers);
        // Getting data from the req body

        const {data,type} = req.body;
        const userData = {
            _id : data._id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url
        };
        // Switch cases for different events

        switch (type) {
            case "user.created":
                 await User.create(userData);
                break;

                case "user.updated":
                 await User.findByIdAndUpdate(data.id, userData);
                break;

                case "user.deleted":
                 await User.findByIdAndDelete(data.id);
                break;
        
            default:
                break;
        }

        res.JSON({success: true, message: "Webhook Recieved"})

     } catch (error) {
        console.log(error.message);
        res.JSON({success: false, message: error.message})
     }
}

export default clerkWebhooks;