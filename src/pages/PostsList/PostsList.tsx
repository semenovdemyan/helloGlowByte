import styles from '../pages.module.css';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchPosts,
  toggleSelectPost,
  deleteSelectedPosts,
  toggleSortDirection,
} from '../../redux/posts/postsSlice';

import type { Post } from '../../redux/posts/postsSlice.types';

import { ColumnsType } from 'antd/es/table';
import { PostsTable } from '../../components/Table/PostsTable';
import { PostsSelect } from '../../components/Select/PostsSelect';
import { PostsInput } from '../../components/Input/Input';
import { PostsButton } from '../../components/Button/Button';
import { PostsModal } from '../../components/Modal/PostsModal';
import { Typography, Tooltip, Flex } from 'antd';

const { Title } = Typography;

export const PostsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { posts, loading, selectedPosts, sortDirection } = useAppSelector(
    (state) => state.posts
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Фильтрация постов
  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  // Сортировка постов с копией массива, чтобы не мутировать исходный
  const sortedPosts = useMemo(() => {
    const postsCopy = [...filteredPosts]; // Создаем копию массива
    return postsCopy.sort((a, b) => {
      if (sortDirection === 'ascending') {
        return a.userId - b.userId;
      } else {
        return b.userId - a.userId;
      }
    });
  }, [filteredPosts, sortDirection]);

  // Оптимизация колонок таблицы
  const columns: ColumnsType<Post> = useMemo(
    () => [
      {
        title: 'ID пользователя',
        dataIndex: 'userId',
        sorter: (a: Post, b: Post) => {
          if (sortDirection === 'ascending') {
            return a.userId - b.userId;
          } else {
            return b.userId - a.userId;
          }
        },
        onHeaderCell: () => ({
          onClick: () => dispatch(toggleSortDirection()),
        }),
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
    ],
    [dispatch, selectedPosts, sortDirection, navigate]
  );

  // Обработчик удаления
  const handleDelete = () => {
    dispatch(deleteSelectedPosts());
    setIsModalVisible(false);
  };

  // Обработчик изменения размера страницы
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Пагинация
  const paginatedPosts = useMemo(() => {
    return sortedPosts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedPosts, currentPage, pageSize]);

  return (
    <div className={styles.container}>
      <Title>Посты</Title>
      <div className="menu">
        <Flex gap={'15px'} style={{ marginBottom: '20px' }}>
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
