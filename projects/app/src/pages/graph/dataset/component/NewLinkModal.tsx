// @ts-nocheck
// import {
//   ModalForm,
//   ProForm,
//   ProFormDateRangePicker,
//   ProFormSelect,
//   ProFormText
// } from '@ant-design/pro-components';
// import { Button, Form, message } from 'antd';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { deleteNode, editNode, getNodes, newNode, newLink } from '@/web/core/graph/api';
const { ModalForm, ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText } = dynamic(
  (): any =>
    import('@ant-design/pro-components').then(
      ({ ModalForm, ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText }) => ({
        ModalForm,
        ProForm,
        ProFormDateRangePicker,
        ProFormSelect,
        ProFormText
      })
    ),
  {
    ssr: false
  }
);
const { Button, Form, message } = dynamic(
  (): any => import('antd').then(({ Button, Form, message }) => ({ Button, Form, message })),
  {
    ssr: false
  }
);

const NewLinkModal = ({ onFinish }: { onFinish: any }) => {
  const [form] = Form.useForm<{ name: string; company: string }>();

  const selectDataPromise = useMemo(() => {
    return new Promise<{ label: string; value: string }[]>(async (resolve) => {
      const { data } = await getNodes();
      resolve(
        data.map(({ name, id, type }) => ({
          label: name,
          value: id,
          type: type
        }))
      );
    });
  }, []);

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="新建关联"
      trigger={<Button type="primary">新建关联</Button>}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true
      }}
      width={400}
      onFinish={async ({ source, target }: any) => {
        console.log(source, target);
        try {
          await newLink({
            source,
            target
          });
          message.success('提交成功');
          onFinish();
        } catch (error) {
          message.error('提交失败');
          return false;
        }
        return true;
      }}
    >
      <ProFormSelect
        name="source"
        label="Source:"
        request={() => selectDataPromise}
        showSearch={true}
        fieldProps={{ labelInValue: true }}
      />
      <ProFormSelect
        name="target"
        label="Target:"
        request={() => selectDataPromise}
        showSearch={true}
        fieldProps={{ labelInValue: true }}
      />
    </ModalForm>
  );
};

export default NewLinkModal;
