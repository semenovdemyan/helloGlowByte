import { useState, FC } from 'react';
import { Button as AntButton } from 'antd';
import { PostsModal } from '../Modal/PostsModal.tsx';
import { deleteSelectedPosts } from '../../redux/posts/postsSlice.ts';
import { useAppDispatch } from '../../hooks';

interface ButtonProps {
  disabled: boolean;
}

export const PostsButton: FC<ButtonProps> = ({ disabled }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);

  const deletePosts = () => {
    dispatch(deleteSelectedPosts());
    setOpen(false);
  }

  return (
      <>
        <AntButton type="primary" danger disabled={disabled} onClick={() => setOpen(true)}>
          Удалить выбранные посты
        </AntButton>
        <PostsModal onCancel={() => setOpen(false)} onOk={deletePosts} open={open}/>
      </>
  );
};
