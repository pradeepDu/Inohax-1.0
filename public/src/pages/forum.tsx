import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Reply and Post interfaces
interface Reply {
  id: number;
  author: string;
  content: string;
  date: string;
}

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  replies: Reply[];
}

const samplePosts: Post[] = [
  {
    id: 1,
    title: "Welcome to our new forum!",
    author: "Admin",
    date: "2024-09-20",
    content:
      "Hello everyone! Welcome to our brand new forum. Feel free to introduce yourselves and start discussions!",
    replies: [],
  },
  {
    id: 2,
    title: "Tips for productive discussions",
    author: "Moderator",
    date: "2024-09-21",
    content:
      "Here are some tips to keep our discussions productive and respectful...",
    replies: [],
  },
  {
    id: 3,
    title: "What's your go to read blogs?",
    author: "BookWorm",
    date: "2024-09-22",
    content:
      "I'm always looking for new reading recommendations for articles on ML. What's your all-time favorite Website and why?",
    replies: [],
  },
  {
    id: 4,
    title: "How do i solve this error?",
    author: "Baller",
    date: "2024-09-21",
    content:
      "I have been encountering the problem with the tesseract engine as it seems to not run in my system, please somebody help!!!",
    replies: [],
  },
  {
    id: 5,
    title: "syntax error",
    author: "sanjay",
    date: "2024-09-21",
    content: "I have been facing an error with the gcc compiler for my C++ in VS code, please someone help :)",
    replies: [],
  },
];

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  const [newQuestionTitle, setNewQuestionTitle] = useState<string>("");
  const [newQuestionContent, setNewQuestionContent] = useState<string>("");
  const [showAddQuestionForm, setShowAddQuestionForm] = useState<boolean>(false);

  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  // Fetch AI response from backend server
  const generateAIResponse = async () => {
    if (!selectedPost) return;

    setIsLoading(true);
    try {
      const prompt = `Given this forum post: "${selectedPost.title}: ${selectedPost.content}", 
                      generate a thoughtful and engaging response in about 2-3 sentences.`;

      const response = await axios.post("http://localhost:5000/generate-ai-response", { prompt });
      setAiResponse(response.data.aiResponse || "No response generated.");
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAiResponse("Sorry, I couldn't generate a response at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !replyContent.trim()) return;

    const newReply: Reply = {
      id: Date.now(),
      author: "User", // You might want to replace this with actual user info
      content: replyContent,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedPosts = posts.map((post) =>
      post.id === selectedPost.id
        ? { ...post, replies: [...post.replies, newReply] }
        : post
    );

    setPosts(updatedPosts);
    setSelectedPost({
      ...selectedPost,
      replies: [...selectedPost.replies, newReply],
    });
    setReplyContent("");
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      title: newQuestionTitle,
      author: "User", // You might want to replace this with actual user info
      date: new Date().toISOString().split("T")[0],
      content: newQuestionContent,
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewQuestionTitle("");
    setNewQuestionContent("");
    setShowAddQuestionForm(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Community Forum</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Discussions</h2>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
            >
              {showAddQuestionForm ? "Cancel" : "Add Question"}
            </button>
          </div>

          {showAddQuestionForm && (
            <form onSubmit={handleAddQuestion} className="mb-6">
              <input
                type="text"
                placeholder="Question Title"
                className="input input-bordered w-full mb-2"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
              />
              <textarea
                placeholder="Question Content"
                className="textarea textarea-bordered w-full mb-2"
                value={newQuestionContent}
                onChange={(e) => setNewQuestionContent(e.target.value)}
                rows={3}
              ></textarea>
              <button type="submit" className="btn btn-primary w-full">
                Post Question
              </button>
            </form>
          )}

          <ul className="menu bg-base-200 rounded-box">
            {filteredPosts.map((post) => (
              <li key={post.id}>
                <a
                  onClick={() => setSelectedPost(post)}
                  className="flex justify-between items-center"
                >
                  <span>{post.title}</span>
                  <span className="badge">{post.replies.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-2/3">
          {selectedPost ? (
            <div className="bg-base-200 p-6 rounded-box">
              <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
              <div className="flex justify-between text-sm text-base-content/70 mb-4">
                <span>Posted by {selectedPost.author}</span>
                <span>{selectedPost.date}</span>
              </div>
              <p className="mb-4">{selectedPost.content}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">
                  {selectedPost.replies.length} replies
                </span>
                <button
                  className="btn btn-primary"
                  onClick={generateAIResponse}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate AI Response"}
                </button>
              </div>
              {aiResponse && (
                <div className="bg-base-100 p-4 rounded-box mt-4 mb-4">
                  <h3 className="font-semibold mb-2">AI Generated Response:</h3>
                  <p>{aiResponse}</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Replies</h3>
                {selectedPost.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-base-100 p-4 rounded-box mb-4"
                  >
                    <div className="flex justify-between text-sm text-base-content/70 mb-2">
                      <span>{reply.author}</span>
                      <span>{reply.date}</span>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))}
                <form onSubmit={handleReply}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="textarea textarea-bordered w-full mb-2"
                    rows={3}
                  ></textarea>
                  <button type="submit" className="btn btn-primary w-full">
                    Post Reply
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div>Select a post to view details and replies.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
