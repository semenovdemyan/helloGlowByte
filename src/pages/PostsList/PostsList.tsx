import styles from '../pages.module.css';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchPosts,
  toggleSelectPost,
  deleteSelectedPosts,
} from '../../redux/slice';
import { ColumnsType } from 'antd/es/table';

import { PostsTable } from '../../components/Table/PostsTable';
import { PostsSelect } from '../../components/Select/PostsSelect';
import { PostsInput } from '../../components/Input/Input';
import { PostsButton } from '../../components/Button/Button';
import { PostsModal } from '../../components/Modal/PostsModal';
// import { Flex } from '../../components/Flex/Flex';

import { Typography, Tooltip, Flex } from 'antd';
const { Title } = Typography;

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const PostsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { posts, loading, selectedPosts } = useAppSelector(
    (state) => state.posts
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const columns: ColumnsType<Post> = [
    {
      title: 'ID пользователя',
      dataIndex: 'userId',
      sorter: (a: Post, b: Post) => a.userId - b.userId,
    },
    {
      title: 'Заголовок',
      dataIndex: 'title',
      render: (text: string, record: Post) => (
        <a onClick={() => navigate(`/post/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Контент',
      render: (_: unknown, record: Post) => (
        <Tooltip title={record.body}>
          {record.body.length > 50
            ? `${record.body.slice(0, 50)}...`
            : record.body}
        </Tooltip>
      ),
    },
    {
      title: 'Выбрать',
      render: (_: unknown, record: Post) => (
        <input
          type="checkbox"
          checked={selectedPosts.includes(record.id)}
          onChange={() => dispatch(toggleSelectPost(record.id))}
        />
      ),
    },
  ];

  const handleDelete = () => {
    dispatch(deleteSelectedPosts());
    setIsModalVisible(false);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles.container}>
      <Title>Посты</Title>
      <div className={styles.menu}>
        <Flex>
          <PostsSelect value={pageSize} onChange={handlePageSizeChange} />
          <PostsInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PostsButton
            disabled={!selectedPosts.length}
            onClick={() => setIsModalVisible(true)}
          />
        </Flex>
      </div>

      <PostsTable
        columns={columns}
        dataSource={paginatedPosts}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={filteredPosts.length}
        onPageChange={handlePageChange}
      />

      <PostsModal
        title="Точно удаляем выбранные посты?"
        onCancel={() => setIsModalVisible(false)}
        visible={isModalVisible}
        onOk={handleDelete}
      />
    </div>
  );
};
