import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service';
import { Table, Form, Input, Space, Button } from 'antd';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [form] = Form.useForm();
  const getData = useCallback(() => {
    (async () => {
      const cls = await doGet('/clients', { page: 1, pageSize: 100 });
      setClients(cls.data);
    })();
  }, []);
  useEffect(() => {
    getData();
  }, []);
  return (
    <PageLayout title="Client">
      <Form
        form={form}
        onFinish={async (values) => {
          await doPost('/clients', values);
          await getData();
          form.resetFields();
        }}
      >
        <Space direction="row">
          <Form.Item name="name">
            <Input placeholder="Tên client" />
          </Form.Item>
          <Button type="primary" onClick={() => form.submit()}>
            Thêm
          </Button>
        </Space>
      </Form>

      <Table
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
            title: 'Thao tác',
            align: 'left',
            render: (value, record, index) => {
              return (
                <Space>
                  <Button
                    type="ghost"
                    danger
                    onClick={async () => {
                      await doDelete(`/clients/${record.id}`);
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
        rowKey={'id'}
        dataSource={clients}
      />
    </PageLayout>
  );
};

export default Client;
