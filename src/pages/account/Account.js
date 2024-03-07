// accounts.js

import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Space, Button, message, Modal, Tag, Select } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete, doPut } from '../../service';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [tags, setTags] = useState([]);
  const [clients, setClients] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [links, setLinks] = useState([]);

  async function getAccounts() {
    try {
      const response = await doGet('/accounts', { page: 1, pageSize: 1000 });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      message.error('Lấy danh sách tài khoản lỗi ' + error.message);
    }
  }

  async function getTags() {
    try {
      const response = await doGet('/tags', { page: 1, pageSize: 1000 });
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      message.error('Lấy danh sách tag lỗi ' + error.message);
    }
  }

  async function getClients() {
    try {
      const response = await doGet('/clients', { page: 1, pageSize: 1000 });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      message.error('Lấy danh sách client lỗi ' + error.message);
    }
  }

  async function getLinks() {
    try {
      const response = await doGet('/links');
      console.log(response.data);
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching links:', error.message);
      message.error('Lấy danh sách link lỗi ' + error.message);
    }
  }

  useEffect(() => {
    getAccounts();
    getTags();
    getClients();
    getLinks();
  }, []);

  const handleDelete = async (accountId) => {
    try {
      await doDelete(`/accounts/${accountId}`);
      await getAccounts();
      message.success('Xóa tài khoản thành công.');
    } catch (error) {
      console.error('Error deleting account:', error.message);
      message.error('Xóa tài khoản lỗi' + error.message);
    }
  };

  const handleAddAccount = async (values) => {
    try {
      await doPost('/accounts', values);
      await getAccounts();
      setIsModalVisible(false);
      message.success('Thêm tài khoản thành công.');
    } catch (error) {
      console.error('Error adding account:', error.message);
      message.error('Thêm tài khoản lỗi' + error.message);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <PageLayout title="Tài khoản">
      <>
        <Button type="primary" onClick={showModal}>
          Thêm tài khoản
        </Button>
        <Table
          pagination={{
            pageSize: 100,
          }}
          columns={[
            {
              title: 'Tên',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Thông tin',
              dataIndex: 'info',
              key: 'info',
            },
            {
              title: 'Chủ đề',
              key: 'tags',
              render: (value, record, index) => {
                return (
                  <Select
                    mode="multiple"
                    value={record?.tags || []}
                    style={{ width: 200 }}
                    placeholder="Chọn tag"
                    onChange={async (value) => {
                      await doPut(`/accounts/${record._id}`, { ...record, tag: value });
                      await getAccounts();
                      message.success('Cập nhật tiến trình thành công');
                    }}
                  >
                    {tags.map((tag) => (
                      <Select.Option key={tag._id} value={tag._id}>
                        {tag.name}
                      </Select.Option>
                    ))}
                  </Select>
                );
              },
            },
            {
              title: 'Client',
              key: 'client_assigned_to',
              render: (value, record, index) => {
                return (
                  <Select
                    defaultValue={record?.client_assigned_to || null}
                    style={{ width: 200 }}
                    placeholder="Chọn client"
                    onChange={async (value) => {
                      await doPut(`/accounts/${record._id}`, {
                        ...record,
                        client_assigned_to: value,
                      });
                      await getAccounts();
                      message.success('Cập nhật tiến trình thành công');
                    }}
                  >
                    {clients.map((client) => (
                      <Select.Option key={client._id} value={client._id}>
                        {client.name}
                      </Select.Option>
                    ))}
                  </Select>
                );
              },
            },
            {
              title: 'Links', // New column for links
              key: 'links',
              render: (value, record, index) => {
                console.log('links', record?.links, Array.isArray(record.links));
                return (
                  <Select
                    mode="multiple"
                    value={record?.links || []}
                    style={{ width: 200 }}
                    placeholder="Chọn links"
                    onChange={async (value) => {
                      // Assuming the endpoint to update links is '/updateLinks/:id'
                      await doPut(`/updateLinks/${record._id}`, { links: value });
                      await getAccounts();
                      message.success('Cập nhật links thành công');
                    }}
                  >
                    {/* Assuming links is an array fetched from somewhere */}
                    {links.map((link) => (
                      <Select.Option key={link._id} value={link._id}>
                        {link.title}
                      </Select.Option>
                    ))}
                  </Select>
                );
              },
            },
            {
              title: 'Hành động',
              render: (value, record) => (
                <Space>
                  <Button type="ghost" danger onClick={() => handleDelete(record._id)}>
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={accounts}
          rowKey="_id"
        />
      </>
      <Modal
        title="Thêm tài khoản"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleAddAccount}>
          <Form.Item label="Tên" name="name">
            <Input placeholder="Nhập tên tài khoản" />
          </Form.Item>
          <Form.Item label="Thông tin" name="info">
            <Input placeholder="Nhập thông tin tài khoản (ví dụ username|password|2fa" />
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  );
};

export default Accounts;
