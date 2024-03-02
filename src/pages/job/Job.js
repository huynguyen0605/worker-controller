// jobs.js

import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Space, Button, message } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [form] = Form.useForm();

  async function getJobs() {
    const response = await doGet('/jobs', { page: 1, pageSize: 10 });
    setJobs(response.data);
  }

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <PageLayout title="Danh sách Job">
      <>
        <Table
          bordered
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Code',
              dataIndex: 'code',
              key: 'code',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
            },
            {
              title: 'Client',
              dataIndex: 'client_name',
              key: 'client_name',
            },
            {
              title: 'Thao tác',
              render: (value, record) => (
                <Space>
                  <Button
                    type="ghost"
                    danger
                    onClick={async () => {
                      await doDelete(`/jobs/${record._id}`);
                      await getJobs();
                    }}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={jobs}
          rowKey="_id"
        />
      </>
    </PageLayout>
  );
};

export default Jobs;
