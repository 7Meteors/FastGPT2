import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import { useTranslation } from 'next-i18next';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import { editEvent, editNode, newEvent } from '@/web/core/graph/api';
import { NodeTypeMap } from '../index';

const transToValueEnum = (data: any) => {
  const result = {} as any;
  for (let key in data) {
    result[key] = data[key].label;
  }
  return result;
};

const EventModal = ({
  open,
  urgencyMap,
  categoryData,
  editData,
  onClose,
  onFinish
}: {
  onFinish: any;
  urgencyMap: any;
  categoryData: any;
  open: boolean;
  editData?: any;
  onClose: any;
}) => {
  const { t } = useTranslation();

  const [form] = Form.useForm<{ name: string; company: string }>();

  useEffect(() => {
    form.resetFields();
    if (editData) {
      form.setFieldsValue(editData || {});
    }
  }, [editData, form, open]);

  return (
    open && (
      <ModalForm<{
        name: string;
        company: string;
      }>
        open={open}
        title={editData?.id ? t('graph:dataset.edit event') : t('graph:dataset.new event')}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: onClose
        }}
        width={400}
        onFinish={async (values: any) => {
          try {
            console.log('values', values);

            if (editData?.id) {
              await editEvent({
                ...editData,
                ...values,
                old_category_small_sym: editData?.category_small_sym
              });
            } else {
              await newEvent(values);
            }
            message.success('提交成功');
            onFinish();
            return true;
          } catch (error) {
            // message.error('提交失败');
            return false;
          }
        }}
      >
        <ProFormText
          name="issue"
          label={t('graph:dataset.event issue')}
          rules={[{ required: true }]}
        />
        <ProFormText
          name="address"
          label={t('graph:dataset.event address')}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="urgency_sym"
          label={t('graph:dataset.event urgency')}
          rules={[{ required: true }]}
          valueEnum={urgencyMap}
        />
        <ProFormSelect
          name="category_small_sym"
          label={t('graph:dataset.event smallcategory')}
          valueEnum={categoryData.smallCategories}
        />
        {/* <ProFormDependency name={['category_small_sym']}>
          {({ category_small_sym }) => {
            return (
              category_small_sym && (
                <ProFormSelect
                  name="category_big_sym"
                  label={t('graph:dataset.event bigcategory')}
                  disabled
                  value={}
                  valueEnum={categoryData.bigCategories}
                />
              )
            );
          }}
        </ProFormDependency> */}
      </ModalForm>
    )
  );
};

export default EventModal;
