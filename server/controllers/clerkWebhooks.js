import User from "../models/User.js";
import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = whook.verify(
      JSON.stringify(req.body),
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]
      }
    );

    const event = payload;

    if (event.type === "user.created") {
      const { id, email_addresses, image_url, username } = event.data;

      await User.create({
        _id: id,
        username: username || "NoName",
        email: email_addresses?.[0]?.email_address || "noemail@example.com",
        image: image_url,
        role: "user",
        recentSearchedCities: []
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.log("Webhook error:", error);
    console.log("Payload:", req.body);
    console.log("Headers:", req.headers);
    res.status(400).json({ success: false });
  }
};

export default clerkWebhooks;
