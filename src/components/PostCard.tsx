import styles from "./PostCard.module.css";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types/post";
import { getPreview } from "../utils/text";

type Props = {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{post.title}</h2>

      <p className={styles.preview}>
        {getPreview(post.content ?? "", 100)}
      </p>

      <div className={styles.meta}>
        {new Date(post.createdAt).toLocaleDateString()}
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