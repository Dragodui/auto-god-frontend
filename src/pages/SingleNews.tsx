'use client';

import { useParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import SingleContent from '@/components/SingleContent';
import { getOneNews, likeNews, viewNews } from '@/services/newsService';

const SingleNews = () => {
  const { newsId } = useParams();
  const { userId } = useAuth();

  return (
    <SingleContent
      id={newsId as string}
      contentType="news"
      fetchData={getOneNews}
      likeItem={likeNews}
      viewItem={viewNews}
      backLink="/news"
      backText="Back to News"
      moreLink="/news"
      moreText="More News"
      userId={userId}
    />
  );
};

export default SingleNews;
