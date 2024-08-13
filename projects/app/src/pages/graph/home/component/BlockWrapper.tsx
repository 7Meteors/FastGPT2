import React from 'react';
import MyBox from '@fastgpt/web/components/common/MyBox';

const BlockWrapper: React.FC<{ children: any }> = ({ children }) => {
  return (
    <MyBox
      display={'flex'}
      flexDirection={'column'}
      py={3}
      px={5}
      cursor={'pointer'}
      borderWidth={1.5}
      bg={'white'}
      borderRadius={'md'}
      minH={'130px'}
      position={'relative'}
      _hover={{
        borderColor: 'primary.300',
        boxShadow: '1.5',
        '& .delete': {
          display: 'block'
        },
        '& .more': {
          display: 'flex'
        }
      }}
    >
      {children}
    </MyBox>
  );
};

export default BlockWrapper;
