import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch all active stories
 */
export async function fetchStories() {
    try {
        const response = await fetch("/api/stories");

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`Failed to fetch stories: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching stories:", error);
        throw error;
    }
}

/**
 * Add a new story
 */
export async function addStory(storyData: {
    id: string;
    title: string;
    media: string;
    type: string;
    username: string;
    privacy: string;
}) {
    try {
        const response = await fetch("/api/stories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(storyData),
        });

        if (!response.ok) {
            throw new Error(`Failed to add story: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding story:", error);
        throw error;
    }
}

/**
 * Add a comment to a story
 */
export async function addComment(storyId: string, text: string, username: string) {
    try {
        const commentData = {
            storyId,
            id: uuidv4(),
            username, // ✅ Now comes from function parameter
            text,
            time: Date.now(), 
        };

        console.log("Adding comment to story:", storyId, commentData);

        return commentData;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

/**
 * Like a story
 */
export async function likeStory(storyId: string, name: string, username: string, profileImage: string) {
    try {
        console.log("Liking story:", storyId);

        return {
            success: true,
            likes: 1,
            likers: [
                {
                    id: uuidv4(),
                    name,
                    username,
                    profileImage,
                },
            ],
        };
    } catch (error) {
        console.error("Error liking story:", error);
        throw error;
    }
}

/**
 * View a story (increment view count)
 */
export async function viewStory(storyId: string) {
    try {
        console.log("Viewing story:", storyId);

        return {
            success: true,
            views: 1,
            viewers: [
                {
                    id: "user123",
                    name: "Current User",
                    username: "@current_user",
                    avatar: "/images/avatar-current.jpg",
                    time: new Date().toISOString(),
                },
            ],
        };
    } catch (error) {
        console.error("Error updating view count:", error);
        throw error;
    }
}
