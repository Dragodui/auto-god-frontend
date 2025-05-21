import { useParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import SingleContent from '@/components/SingleContent';
import { getPost, likePost, viewPost } from '@/services/postsService';

const SinglePost = () => {
  const { postId } = useParams();
  const { userId } = useAuth();

  return (
    <SingleContent
      id={postId as string}
      contentType="post"
      fetchData={getPost}
      likeItem={likePost}
      viewItem={viewPost}
      backLink="/posts"
      backText="Back to Posts"
      moreLink="/posts"
      moreText="More Posts"
      userId={userId}
    />
  );
};

export default SinglePost;
