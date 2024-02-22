import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doPut, doDelete } from '../../service';
import { Table, Form, Input, Space, Button, Modal } from 'antd';

const Interaction = () => {
  const [interactions, setInteractions] = useState([]);
  const [form] = Form.useForm();
  async function getData() {
    const cls = await doGet('/interactions', { page: 1, pageSize: 100 });
    setInteractions(cls.data);
  }
  useEffect(() => {
    getData();
  }, []);

  const [editingInteraction, setEditingInteraction] = useState(null);
  const handleEditClick = (record) => {
    setEditingInteraction(record);
    form.setFieldsValue(record);
  };
  const handleEditCancel = () => {
    setEditingInteraction(null);
    form.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await doPut(`/interactions/${editingInteraction._id}`, values);
      await getData();
      handleEditCancel();
    } catch (error) {
      console.error('Validation failed', error);
    }
  };

  return (
    <PageLayout title="Thao tác">
      <>
        <Form
          form={form}
          onFinish={async (values) => {
            await doPost('/interactions', values);
            await getData();
            form.resetFields();
          }}
        >
          <Space direction="row">
            <Form.Item name="name">
              <Input placeholder="Tên thao tác" />
            </Form.Item>
            <Form.Item name="content">
              <Input placeholder="Code thao tác" />
            </Form.Item>
            <Form.Item name="params">
              <Input placeholder="Danh sách tham số bổ sung" />
            </Form.Item>
            <Button type="primary" onClick={() => form.submit()}>
              Thêm
            </Button>
          </Space>
        </Form>

        <Table
          bordered
          columns={[
            {
              title: 'STT',
              align: 'center',
              width: 90,
              render: (value, record, index) => index + 1,
            },
            {
              title: 'Tên',
              align: 'left',
              render: (value, record, index) => record.name,
            },
            {
              title: 'Code thao tác',
              align: 'left',
              render: (value, record, index) => record.content,
            },
            {
              title: 'Danh sách tham số bổ sung',
              align: 'left',
              render: (value, record, index) => record.params,
            },
            {
              title: 'Sort',
              align: 'left',
              width: 90,
              render: (value, record, index) => {
                return (
                  <Input
                    defaultValue={record.sort}
                    onPressEnter={async (e) => {
                      await doPut(`/interactions/${record._id}`, {
                        ...record,
                        sort: e.target.value,
                      });
                      await getData();
                      message.success('Cập nhật thứ tự thành công');
                    }}
                  />
                );
              },
            },
            {
              title: 'Thao tác',
              align: 'left',
              render: (value, record, index) => {
                return (
                  <Space>
                    <Button type="primary" onClick={() => handleEditClick(record)}>
                      Sửa
                    </Button>
                    <Button
                      type="ghost"
                      danger
                      onClick={async () => {
                        await doDelete(`/interactions/${record._id}`);
                        await getData();
                      }}
                    >
                      Xóa
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          rowKey={'_id'}
          dataSource={interactions}
        />
      </>
      <Modal
        title="Sửa thao tác"
        visible={!!editingInteraction}
        onCancel={handleEditCancel}
        onOk={handleEditSubmit}
      >
        <Form form={form} initialValues={editingInteraction}>
          <Form.Item name="name" label="Tên thao tác">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Code thao tác">
            <Input />
          </Form.Item>
          <Form.Item name="params" label="Danh sách tham số bổ sung">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  );
};

export default Interaction;
