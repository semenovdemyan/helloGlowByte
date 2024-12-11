import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const PostsSelect: React.FC<SelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} style={{ width: 120 }} onChange={onChange}>
      <Option value={10}>10 постов на странице</Option>
      <Option value={20}>20 постов на странице</Option>
      <Option value={50}>50 постов на странице</Option>
      <Option value={100}>100 постов на странице</Option>
    </Select>
  );
};
