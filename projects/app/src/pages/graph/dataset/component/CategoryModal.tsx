import { ModalForm, ProFormTextArea, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useTranslation } from 'next-i18next';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import {
  newBigcategory,
  newSmallcategory,
  editBigcategory,
  editSmallcategory
} from '@/web/core/graph/api';

const transToValueEnum = (data: any) => {
  const result = {} as any;
  for (let key in data) {
    result[key] = data[key].label;
  }
  return result;
};

const CategoryModal = ({
  open,
  isSmallcategory,
  categoryData,
  editData,
  onClose,
  onFinish
}: {
  onFinish: any;
  isSmallcategory: boolean;
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
        title={
          editData?.id
            ? t(
                isSmallcategory
                  ? 'graph:dataset.edit smallcategory'
                  : 'graph:dataset.edit bigcategory'
              )
            : t(
                isSmallcategory
                  ? 'graph:dataset.new smallcategory'
                  : 'graph:dataset.new bigcategory'
              )
        }
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
              await (isSmallcategory ? editSmallcategory : editBigcategory)({
                ...editData,
                ...values,
                ...(editData?.name === values.name ? {} : { oldName: editData?.name }),
                ...(editData?.category_big_sym === values.category_big_sym
                  ? {}
                  : { old_category_big_sym: editData?.category_big_sym })
              });
            } else {
              await (isSmallcategory ? newSmallcategory : newBigcategory)(values);
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
          name="id"
          label={t('graph:dataset.category id')}
          rules={[{ required: true }]}
          disabled={!!editData?.id}
        />
        <ProFormText
          name="name"
          label={t('graph:dataset.category name')}
          rules={[{ required: true }]}
        />
        {isSmallcategory && (
          <>
            <ProFormTextArea name="content" label={t('graph:dataset.category content')} />
            <ProFormText name="unit" label={t('graph:dataset.unit')} />
            <ProFormText name="department" label={t('graph:dataset.department')} />
            <ProFormSelect
              name="category_big_sym"
              label={t('graph:dataset.category belongTo')}
              valueEnum={categoryData?.bigCategories || {}}
            />
          </>
        )}
      </ModalForm>
    )
  );
};

export default CategoryModal;
