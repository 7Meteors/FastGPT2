import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import { useTranslation } from 'next-i18next';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import { editEvent, newEvent } from '@/web/core/graph/api';
import dayjs from 'dayjs';

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
      form.setFieldsValue(
        { ...editData, created_at: editData?.created_at ? editData.created_at : undefined } || {}
      );
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
        initialValues={{ created_at: dayjs().format('YYYY-MM-DD') }}
        width={400}
        onFinish={async (values: any) => {
          try {
            if (editData?.id) {
              await editEvent({
                // ...editData,
                id: editData?.id,
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
        <ProFormDatePicker name="created_at" label={t('graph:dataset.event createAt')} />
      </ModalForm>
    )
  );
};

export default EventModal;
