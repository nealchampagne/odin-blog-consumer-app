import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";

import { getPost } from "../api/posts";
import {
  getCommentsForPost,
  createComment,
  deleteComment,
  updateComment
} from "../api/comments";

import type { Post } from "../types/post";
import type { Comment } from "../types/comment";

import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Pagination state
  const [commentPage, setCommentPage] = useState(1);
  const commentPageSize = 10;
  const [commentTotalPages, setCommentTotalPages] = useState(1);

  const canEditComment = (comment: Comment) => {
    if (!user) return false;
    return comment.authorId === user.id;
  };

  const canDeleteComment = (comment: Comment) => {
    if (!user) return false;
    return comment.authorId === user.id || user.role === "ADMIN";
  };


  // Load post
  useEffect(() => {
    const load = async () => {
      try {
        const postData = await getPost(id!);
        setPost(postData);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Load comments (paginated)
  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await getCommentsForPost(id!, commentPage, commentPageSize);

        setComments(res.data);

        // Clamp totalPages to at least 1
        const pages = Math.max(1, res.totalPages);
        setCommentTotalPages(pages);

        // If comments became empty, reset to page 1
        if (res.totalPages === 0 && commentPage !== 1) {
          setCommentPage(1);
        }
      } catch {
        setError("Failed to load comments.");
      }
    };

    loadComments();
  }, [id, commentPage]);

  const refreshComments = async (page = commentPage) => {
    const res = await getCommentsForPost(id!, page, commentPageSize);
    setComments(res.data);

    const pages = Math.max(1, res.totalPages);
    setCommentTotalPages(pages);

    if (res.totalPages === 0 && page !== 1) {
      setCommentPage(1);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment(id!, { content: commentText });
      setCommentText("");
      await refreshComments();
    } catch {
      setError("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await deleteComment(postId, commentId);

      // Optimistic update
      setComments(prev => prev.filter(c => c.id !== commentId));

      // Fetch fresh data for the correct page
      await refreshComments(commentPage);
    } catch {
      setError("Failed to delete comment.");
    }
  };

  const handleStartCommentEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleSaveCommentEdit = async (postId: string, commentId: string) => {
    try {
      await updateComment(postId, commentId, { content: editCommentText });
      await refreshComments();
      setEditingCommentId(null);
      setEditCommentText("");
    } catch {
      setError("Failed to update comment.");
    }
  };

  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (!post) return <p className={styles.error}>Post not found.</p>;

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <a className={styles.backButton} onClick={() => window.history.back()}>
        &lt; Back
      </a>

      <h1 className={styles.heading}>
        {post.title}
        {!post.published && " - [Draft]"}
      </h1>

      <>
        <div className={`${styles.content} ${styles.markdown}`}>
          <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
        </div>
      </>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsHeading}>Comments</h2>

        {comments.length === 0 ? (
          <p className={styles.empty}>No comments yet.</p>
        ) : (
          <>
            <div className={styles.commentList}>
              {comments.map((c) => (
                <div key={c.id} className={styles.commentCard}>
                  <div className={styles.commentMeta}>
                    {new Date(c.createdAt).toLocaleString()}
                  </div>

                  <div className={styles.commentAuthor}>
                    {c.author.name}
                  </div>


                  {editingCommentId === c.id ? (
                    <div className={styles.editContainer}>
                      <textarea
                        className={styles.textarea}
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />

                      <div className={styles.commentActions}>
                        <button
                          className={styles.submitButton}
                          onClick={() => handleSaveCommentEdit(post.id, c.id)}
                        >
                          Save
                        </button>

                        <button
                          className={styles.cancelButton}
                          onClick={handleCancelCommentEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>{c.content}</div>

                      <div className={styles.commentActions}>
                        {canEditComment(c) && (
                          <button
                            className={styles.editButton}
                            onClick={() => handleStartCommentEdit(c)}
                          >
                            Edit
                          </button>
                        )}

                        {canDeleteComment(c) && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteComment(post.id, c.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {commentTotalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  disabled={commentPage === 1}
                  onClick={() => setCommentPage(commentPage - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {commentPage} of {commentTotalPages}
                </span>

                <button
                  disabled={commentPage === commentTotalPages}
                  onClick={() => setCommentPage(commentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {user ? (
          <div className={styles.addCommentForm}>
            <textarea
              className={styles.textarea}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
            />

            <button className={styles.submitButton} onClick={handleAddComment}>
              Add Comment
            </button>
          </div>
        ) : (
          <div className={styles.loginPrompt}>
            <button
              className={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              Log in to comment
            </button>
          </div>
        )}

      </section>
    </div>
  );
};

export default PostDetail;