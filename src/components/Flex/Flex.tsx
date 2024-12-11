import React from 'react';
import classNames from 'classnames';
import styles from './Flex.module.css'; // Ваши стили для Flex компонента

interface FlexProps {
  direction?: 'row' | 'column';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string | number;
  className?: string;
  children: React.ReactNode;
}

export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  gap = '0',
  className,
  children,
}) => {
  const flexClassName = classNames(styles.flex, className, {
    [styles.row]: direction === 'row',
    [styles.column]: direction === 'column',
    [styles.justifyStart]: justifyContent === 'flex-start',
    [styles.justifyCenter]: justifyContent === 'center',
    [styles.justifyEnd]: justifyContent === 'flex-end',
    [styles.justifyBetween]: justifyContent === 'space-between',
    [styles.justifyAround]: justifyContent === 'space-around',
    [styles.alignStart]: alignItems === 'flex-start',
    [styles.alignCenter]: alignItems === 'center',
    [styles.alignEnd]: alignItems === 'flex-end',
    [styles.alignStretch]: alignItems === 'stretch',
  });

  const style = {
    gap: typeof gap === 'string' ? gap : `${gap}px`,
  };

  return (
    <div className={flexClassName} style={style}>
      {children}
    </div>
  );
};
