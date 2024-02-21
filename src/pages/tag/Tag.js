// Tags.js
import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Space, Button, Modal, message, Tag } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doPut, doDelete } from '../../service'; // Update service functions accordingly

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function getTags() {
    try {
      const response = await doGet('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error.message);
      message.error('Lấy danh sách tag lỗi' + error.message);
    }
  }

  useEffect(() => {
    getTags();
  }, []);

  const handleDelete = async (tagId) => {
    try {
      await doDelete(`/tags/${tagId}`);
      await getTags();
      message.success('Xóa tag thành công.');
    } catch (error) {
      console.error('Error deleting tag:', error.message);
      message.error('Xóa tag lỗi' + error.message);
    }
  };

  const handleAddOrUpdateTag = async (values) => {
    try {
      const values = form.getFieldsValue();
      if (values._id) {
        // If tag ID is present, update the tag
        await doPut(`/tags/${values._id}`, values);
      } else {
        // Otherwise, add a new tag
        await doPost('/tags', values);
      }
      await getTags();
      setIsModalVisible(false);
      message.success('Lưu tag thành công.');
    } catch (error) {
      console.error('Error saving tag:', error.message);
      message.error('Lưu tag lỗi' + error.message);
    }
  };

  const showModal = (record) => {
    console.log('huynvq::========>record', record);
    form.setFieldsValue(record || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên',
      key: 'name',
      render: (value, record, index) => {
        return (
          <Tag style={{ background: record?.color ? record?.color : 'black', color: 'white' }}>
            {record?.name}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      render: (value, record) => (
        <Space>
          <Button type="ghost" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="ghost" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageLayout title="Danh sách tag">
      <>
        <Button type="primary" onClick={() => showModal()}>
          Thêm Tag
        </Button>
        <Table columns={columns} dataSource={tags} rowKey="_id" />
        <Modal title="Sửa/Xóa" visible={isModalVisible} onOk={form.submit} onCancel={handleCancel}>
          <Form form={form} onFinish={handleAddOrUpdateTag}>
            <Form.Item name="_id" hidden>
              <Input hidden />
            </Form.Item>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Màu"
              name="color"
              rules={[{ required: true, message: 'Please input the color!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </PageLayout>
  );
};

export default Tags;
