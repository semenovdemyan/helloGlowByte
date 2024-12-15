import styles from '../pages.module.css';
import { useEffect, useState, useMemo, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  fetchPosts,
  toggleSelectPost,
  toggleSortDirection,
} from '../../../redux/posts/postsSlice.ts';

import type { Post } from '../../../redux/posts/postsSlice.types.ts';

import { ColumnsType } from 'antd/es/table';
import { PostsTable } from '../../../components/Table/PostsTable.tsx';
import { PostsSelect } from '../../../components/Select/PostsSelect.tsx';
import { PostsInput } from '../../../components/Input/Input.tsx';
import { PostsButton } from '../../../components/Button/Button.tsx';
import { Typography, Tooltip, Flex } from 'antd';
import { postsSelector, postReducer } from './selectors';

const { Title } = Typography;

export const PostsList: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, selectedPosts, sortDirection } = useAppSelector(postReducer);
  const posts = useAppSelector(postsSelector);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
    console.log('paginatedPosts',)
    return posts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
  }, [currentPage, pageSize, posts]);

  // Фильтрация постов
  const filteredPosts = useMemo(() => {
    console.log('filteredPosts',)
    return paginatedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paginatedPosts, searchTerm]);


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
          />
        </Flex>
      </div>

      <PostsTable
        columns={columns}
        dataSource={filteredPosts}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={posts.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
