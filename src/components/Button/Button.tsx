import React from 'react';
import { Button as AntButton } from 'antd';

interface ButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const PostsButton: React.FC<ButtonProps> = ({ disabled, onClick }) => {
  return (
    <AntButton type="primary" danger disabled={disabled} onClick={onClick}>
      Удалить выбранные посты
    </AntButton>
  );
};
