import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service';
import { Table, Form, Input, Space, Button } from 'antd';

const Interaction = () => {
  const [interactions, setInteractions] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    async function getData() {
      const cls = await doGet('/interactions', { page: 1, pageSize: 100 });
      setInteractions(cls.data);
    }
    getData();
  }, []);
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
              title: 'Thao tác',
              align: 'left',
              render: (value, record, index) => {
                return (
                  <Space>
                    <Button
                      type="ghost"
                      danger
                      onClick={async () => {
                        await doDelete(`/interactions/${record.id}`);
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
    </PageLayout>
  );
};

export default Interaction;
