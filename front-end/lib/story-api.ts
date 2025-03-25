// Helper functions for interacting with the story API

/**
 * Fetch all active stories
 */
export async function fetchStories() {
    try {
      const response = await fetch("/api/stories")
  
      if (!response.ok) {
        if (response.status === 404) {
          return []
        }
        throw new Error(`Failed to fetch stories: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching stories:", error)
      throw error
    }
  }
  
  /**
   * Add a new story
   */
  export async function addStory(storyData: {
    id: string
    title: string
    media: string
    type: string
    username: string
    privacy: string
  }) {
    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyData),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to add story: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error adding story:", error)
      throw error
    }
  }
  
  /**
   * Add a comment to a story
   */
  export async function addComment(storyId: string, text: string) {
    try {
      // Use the existing Comment model structure from the API
      const commentData = {
        storyId,
        id: Date.now().toString(),
        username: "@current_user", // This would come from auth context in a real app
        text,
        time: new Date().toISOString(),
      }
  
      // We'll use the main stories API since there's no dedicated comments endpoint yet
      console.log("Adding comment to story:", storyId, commentData)
  
      // In a real implementation, you would have a proper endpoint
      // This is a placeholder that won't actually save to the database
      return commentData
    } catch (error) {
      console.error("Error adding comment:", error)
      throw error
    }
  }
  
  /**
   * Like a story
   */
  export async function likeStory(storyId: string) {
    try {
      // Since the API endpoint doesn't exist yet, we'll just log it
      console.log("Liking story:", storyId)
  
      // Return mock data for UI updates
      return {
        success: true,
        likes: 1,
        likers: [
          {
            id: "user123",
            name: "Current User",
            username: "@current_user",
            avatar: "/images/avatar-current.jpg",
          },
        ],
      }
    } catch (error) {
      console.error("Error liking story:", error)
      throw error
    }
  }
  
  /**
   * View a story (increment view count)
   */
  export async function viewStory(storyId: string) {
    try {
      // Since the API endpoint doesn't exist yet, we'll just log it
      console.log("Viewing story:", storyId)
  
      // Return mock data for UI updates
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
      }
    } catch (error) {
      console.error("Error updating view count:", error)
      throw error
    }
  }
  
  