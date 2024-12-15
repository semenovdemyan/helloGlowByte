import { FC } from "react";
import { Modal as AntModal } from "antd";

interface ModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export const PostsModal: FC<ModalProps> = ({ open, onCancel, onOk }) => {
  return (
    <AntModal
      title="Точно удаляем выбранные посты?"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
    />
  );
};
