import { connectToDB } from "@/lib/mongodb";
import UserDetails from "@/models/userDetailsModel";

export async function POST(req) {
  try {
    await connectToDB();

    const { username, bio, location, birthday, website } = await req.json();

    // Generate a random name starting with "Username" followed by 10 random digits
    let name;
    let isUnique = false;

    while (!isUnique) {
      const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000); // Generate 10 random digits
      name = `Username${randomNumbers}`;

      // Check if the generated name is unique
      const existingUser = await UserDetails.findOne({ name });
      if (!existingUser) {
        isUnique = true;
      }
    }

    // Create userDetails without manually setting userId
    const userDetails = new UserDetails({
      username,
      name: name || "",
      bio: bio || "",
      location: location || "",
      birthday: birthday || null,
      website: website || "",
    });

    await userDetails.save(); // MongoDB generates _id automatically

    // **Assign MongoDB-generated _id to userId**
    userDetails.userId = userDetails._id;
    await userDetails.save(); // Save the update

    return new Response(JSON.stringify(userDetails), { status: 201 });
  } catch (error) {
    console.error("Error creating user details:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user details" }),
      { status: 500 }
    );
  }
}
