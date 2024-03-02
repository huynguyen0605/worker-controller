import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { doDelete, doGet, doPost, doPut } from '../../service';
import PageLayout from '../../layout/PageLayout';

const LinkTable = () => {
  const [links, setLinks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await doGet('/links');
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleEdit = (link) => {
    form.setFieldsValue(link);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await doDelete(`/links/${id}`);
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const id = values._id;

      if (id) {
        await doPut(`/links/${id}`, values);
      } else {
        await doPost('/links', values);
      }

      setModalVisible(false);
      form.resetFields();
      fetchLinks();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <PageLayout title="Danh sách link">
      <>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Add Link
        </Button>

        <Table dataSource={links} columns={columns} rowKey="_id" />

        <Modal
          title="Add/Edit Link"
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <Form form={form} layout="vertical" name="linkForm">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="url" label="URL" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </PageLayout>
  );
};

export default LinkTable;
