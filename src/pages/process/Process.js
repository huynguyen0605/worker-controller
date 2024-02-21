import React, { useEffect, useState, useCallback } from 'react';
import { Table, Form, Input, Space, Button, Select, Tag } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service';

const Process = () => {
  const [processes, setProcesses] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [form] = Form.useForm();
  async function getDataProcess() {
    const cls = await doGet('/processes', { page: 1, pageSize: 100 });
    setProcesses(cls.data);
  }
  useEffect(() => {
    getDataProcess();
  }, []);

  useEffect(() => {
    async function getData() {
      const ints = await doGet('/interactions', { page: 1, pageSize: 1000 });
      setInteractions(ints.data);
    }
    getData();
  }, []);

  const handleFormSubmit = async (values) => {
    const { interactions, ...restValues } = values;

    await doPost('/processes', { ...restValues, interactions: interactions });
    await getDataProcess();
    form.resetFields();
  };

  return (
    <PageLayout title="Quy trình">
      <>
        <Form form={form} onFinish={handleFormSubmit}>
          <Space direction="row">
            <Form.Item name="name">
              <Input placeholder="Tên quy trình" />
            </Form.Item>
            <Form.Item name="interactions">
              <Select mode="multiple" style={{ width: '200px' }} placeholder="Chọn thao tác">
                {interactions.map((interaction) => (
                  <Select.Option key={interaction._id} value={interaction._id}>
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
              render: (value, record, index) => {
                return (
                  <div>
                    {record.interactions ? (
                      record.interactions.map((interaction) => interaction.name).join('🫡🫡')
                    ) : (
                      <></>
                    )}
                  </div>
                );
              },
            },
            {
              title: 'Tag',
              align: 'left',
              render: (value, record, index) => {
                return (
                  <div>
                    {record?.is_primary ? (
                      <>
                        <Tag style={{ background: 'green', color: 'white' }}>Mặc định</Tag>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              },
            },
            {
              title: 'Thao tác',
              align: 'left',
              render: (value, record, index) => {
                return (
                  <Space>
                    <Button
                      type="primary"
                      onClick={async () => {
                        await doPost(`/default-process?process_id=${record._id}`);
                        await getDataProcess();
                      }}
                    >
                      Đặt làm mặc định
                    </Button>
                    <Button
                      type="ghost"
                      danger
                      onClick={async () => {
                        await doDelete(`/processes/${record._id}`);
                        await getDataProcess();
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
          dataSource={processes}
        />
      </>
    </PageLayout>
  );
};

export default Process;
