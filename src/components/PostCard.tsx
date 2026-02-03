import styles from "./PostCard.module.css";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types/post";
import { getPreview } from "../utils/text";

type Props = {
  post: Post;
}

// Component to display a summary card for a blog post
const PostCard = ({ post }: Props) => {
  const navigate = useNavigate();

  const formatPublishedAt = (dateString: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return `${datePart} - ${timePart}`;
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{post.title}</h2>

      <p className={styles.preview}>
        {getPreview(post.content ?? "", 100)}
      </p>

      <div className={styles.meta}>
        {formatPublishedAt(post.publishedAt ?? null)}
      </div>

      <button
        className={styles.viewButton}
        onClick={() => navigate(`/posts/${post.id}`)}
      >
        View more
      </button>
    </div>
  );
};

export default PostCard;