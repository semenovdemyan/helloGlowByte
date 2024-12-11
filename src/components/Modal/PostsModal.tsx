import React from 'react';
import { Modal as AntModal } from 'antd';

interface ModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export const PostsModal: React.FC<ModalProps> = ({
  title,
  visible,
  onCancel,
  onOk,
}) => {
  return (
    <AntModal title={title} open={visible} onCancel={onCancel} onOk={onOk} />
  );
};
