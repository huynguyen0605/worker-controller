import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete, doPut } from '../../service';
import { Table, Form, Input, Space, Button, Tag, Select, message } from 'antd';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [form] = Form.useForm();
  async function getData() {
    const cls = await doGet('/clients', { page: 1, pageSize: 1000 });
    setClients(cls.data);
  }
  useEffect(() => {
    getData();
    getProcess();
  }, []);

  const [processes, setProcesses] = useState([]);
  async function getProcess() {
    const pcs = await doGet('/processes', { page: 1, pageSize: 1000 });
    setProcesses(pcs.data);
  }

  return (
    <PageLayout title="Client">
      <>
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
          bordered
          pagination={{
            pageSize: 20,
          }}
          rowKey={'_id'}
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
              title: 'Tiến trình được gán',
              width: 200,
              align: 'left',
              render: (value, record, index) => {
                return (
                  <Select
                    defaultValue={record?.process?._id}
                    style={{ width: 200 }}
                    placeholder="Chọn tiến trình"
                    onChange={async (value) => {
                      await doPut(`/clients/${record._id}`, { ...record, process: value });
                      await getData();
                      message.success('Cập nhật tiến trình thành công');
                    }}
                  >
                    {processes.map((process) => (
                      <Select.Option key={process._id} value={process._id}>
                        {process.name}
                      </Select.Option>
                    ))}
                  </Select>
                );
              },
            },
            {
              title: 'Trạng thái',
              align: 'left',
              render: (value, record, index) => {
                if (record.available) {
                  return <Tag style={{ background: 'green', color: 'white' }}>Khả dụng</Tag>;
                } else {
                  return <Tag>Không khả dụng</Tag>;
                }
              },
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
                        await doDelete(`/clients/${record._id}`);
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
          dataSource={clients}
        />
      </>
    </PageLayout>
  );
};

export default Client;
