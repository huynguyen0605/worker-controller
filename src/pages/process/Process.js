import React, { useEffect, useState, useCallback } from 'react';
import { Table, Form, Input, Space, Button, Select } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service';

const Process = () => {
  const [processes, setProcesses] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [form] = Form.useForm();
  const getData = useCallback(() => {
    (async () => {
      const cls = await doGet('/processes', { page: 1, pageSize: 100 });
      setProcesses(cls.data);
    })();
  }, []);
  useEffect(() => {
    getData();
  }, []);

  useEffect(async () => {
    const ints = await doGet('/interactions', { page: 1, pageSize: 1000 });
    setInteractions(ints.data);
  }, []);

  const [selectingInteraction, setSelectingInteraction] = useState();

  return (
    <PageLayout title="Quy trình">
      <Form
        form={form}
        onFinish={async (values) => {
          await doPost('/processes', values);
          await getData();
          form.resetFields();
        }}
      >
        <Space direction="row">
          <Form.Item name="name">
            <Input placeholder="Tên quy trình" />
          </Form.Item>
          <Form.Item name="interactions">
            <Select
              value={selectingInteraction}
              onChange={(value) => setSelectingInteraction(value)}
              style={{ width: 200 }}
            >
              {interactions.map((interaction) => (
                <Select.Option key={interaction.name} value={interaction.id}>
                  {interaction.name}
                </Select.Option>
              ))}
            </Select>
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
            title: 'Danh sách thao tác',
            align: 'left',
            render: (value, record, index) => record.interactions,
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
                      await doDelete(`/processes/${record.id}`);
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
        dataSource={processes}
      />
    </PageLayout>
  );
};

export default Process;
