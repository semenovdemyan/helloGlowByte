import styles from '../pages.module.css';

import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

interface Post {
  title: string;
  body: string;
}

export const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        setPost(postResponse.data);

        const commentsResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${id}/comments`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  return (
    <div className={styles.container}>
      <h1>Пост {id}</h1>
      <div className={styles.post}>
        {post && (
          <>
            <div className={styles.postTitle}>
              <h2>{post.title}</h2>
            </div>
            <div className={styles.postBody}>
              <p>{post.body}</p>
            </div>
          </>
        )}
      </div>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={comments}
        renderItem={(item) => (
          <List.Item>
            <div>
              <List.Item.Meta
                description={`Автор: ${item.email}`}
                title={item.name}
              />
              <div>{item.body}</div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
