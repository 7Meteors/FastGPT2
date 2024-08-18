import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useMemo } from 'react';
import { deleteNode, editNode, getNodes, newNode, newLink } from '@/web/core/graph/api';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

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
