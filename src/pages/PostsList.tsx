import { useEffect, useState, useCallback} from "react";
import styles from "./PostsList.module.css";

import { getPosts } from "../api/posts.js";
import EmptyState from "../components/EmptyState.jsx";

import type { Post } from "../types/post.js";
import PostCard from "../components/PostCard.jsx";

// Display blog post previews with pagination
const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = useCallback(async () => {
    setLoading(true);

    const res = await getPosts(page, pageSize);

    // Defensive checks
    const data = Array.isArray(res?.data) ? res.data : [];
    setPosts(data);

    const pages = typeof res?.totalPages === "number" ? res.totalPages : 1;
    setTotalPages(pages);

    setLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    const run = async () => {
      await loadPosts();
    };
    run(); 
  }, [loadPosts]);

  return (
    <div className={styles.container}>

      <h1 className={styles.heading}>Hot Content</h1>

      {loading ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet."
          message="Check back later for updates."
        />
      ) : (
        <>
          <div className={styles.list}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={styles.pageButton}
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default PostsList;