import styles from './pages.module.css';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Tooltip,
  Input,
  Button,
  Modal,
  Typography,
  Flex,
  Select,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchPosts,
  toggleSelectPost,
  deleteSelectedPosts,
} from '../redux/slice';
import { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const PostsPage: React.FC = () => {
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

  const filteredPosts = posts.filter((post: Post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Flex className={styles.menu}>
        <Select
          className={styles.postsCountList}
          value={pageSize}
          style={{ width: 120 }}
          onChange={handlePageSizeChange}
        >
          <Option value={10}>10 постов на странице</Option>
          <Option value={20}>20 постов на странице</Option>
          <Option value={50}>50 постов на странице</Option>
          <Option value={100}>100 постов на странице</Option>
        </Select>
        <Input
          className={styles.input}
          placeholder="Поиск по заголовкам"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <Button
          type="primary"
          danger
          disabled={!selectedPosts.length}
          onClick={() => setIsModalVisible(true)}
          className={styles.btn}
        >
          Удалить выбранные посты
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={paginatedPosts}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredPosts.length,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
      />
      <Modal
        title="Точно удаляем выбранные посты?"
        onCancel={() => setIsModalVisible(false)}
        open={isModalVisible}
        onOk={handleDelete}
      ></Modal>
    </div>
  );
};

export default PostsPage;
