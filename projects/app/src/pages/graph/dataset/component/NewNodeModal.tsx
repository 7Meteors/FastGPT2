import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useEffect, useMemo } from 'react';
import { editNode, getNodes, newNode } from '@/web/core/graph/api';
import { NodeTypeMap } from '../index';

const transToValueEnum = (data: any) => {
  const result = {} as any;
  for (let key in data) {
    result[key] = data[key].label;
  }
  return result;
};

const eventStatusMap = {
  caseClosed: '结案',
  caseRefused: '不立案',
  caseToBeFiled: '待立案'
};

const NewNodeModal = ({
  onFinish,
  open,
  editNodeData,
  onClose
}: {
  onFinish: any;
  open: boolean;
  editNodeData?: any;
  onClose: any;
}) => {
  const [form] = Form.useForm<{ name: string; company: string }>();

  useEffect(() => {
    if (editNodeData) {
      form.setFieldsValue(editNodeData || {});
    } else {
      form.resetFields();
    }
  }, [editNodeData, form]);

  return (
    open && (
      <ModalForm<{
        name: string;
        company: string;
      }>
        open={open}
        title={editNodeData?.id ? '编辑节点' : '新建节点'}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: onClose
        }}
        width={400}
        onFinish={async (values: any) => {
          try {
            if (editNodeData?.id) {
              await editNode({
                ...editNodeData,
                ...values,
                ...(editNodeData?.name === values.name ? {} : { oldName: editNodeData?.name })
              });
            } else {
              await newNode(values);
            }
            message.success('提交成功');
            onFinish();
            return true;
          } catch (error) {
            message.error('提交失败');
            return false;
          }
        }}
      >
        <ProFormSelect
          name="type"
          label="节点类型"
          disabled={!!editNodeData?.id}
          rules={[{ required: true }]}
          valueEnum={transToValueEnum(NodeTypeMap)}
        />
        <ProFormText name="name" label="节点名称" rules={[{ required: true }]} />
        <ProFormDependency name={['type']}>
          {({ type }) => {
            switch (type) {
              case NodeTypeMap.smallcategory.value:
                return <ProFormText name="content" rules={[{ required: true }]} label="内容" />;
              case NodeTypeMap.event.value:
                return (
                  <>
                    <ProFormText name="address" label="地址" />
                    <ProFormSelect
                      name="status"
                      label="事件状态"
                      rules={[{ required: true }]}
                      valueEnum={eventStatusMap}
                    />
                  </>
                );
              default:
                break;
            }
          }}
        </ProFormDependency>
      </ModalForm>
    )
  );
};

export default NewNodeModal;
