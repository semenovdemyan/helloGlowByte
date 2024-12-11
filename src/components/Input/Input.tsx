import React from 'react';
import { Input as AntInput } from 'antd';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PostsInput: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <AntInput
      value={value}
      onChange={onChange}
      placeholder="Поиск по заголовкам"
    />
  );
};
