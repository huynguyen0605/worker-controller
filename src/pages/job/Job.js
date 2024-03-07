// jobs.js

import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Space, Button, message, Select, Tooltip } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [form] = Form.useForm();

  const [selectedDomain, setSelectedDomain] = useState('facebook');

  const domainOptions = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Quora', value: 'quora' },
  ];

  async function getJobs() {
    const response = await doGet('/jobs', { page: 1, pageSize: 1000, selectedDomain });
    setJobs(response.data);
  }

  useEffect(() => {
    getJobs();
  }, []);

  const handleDomainChange = (value) => {
    setSelectedDomain(value);
  };

  const handleFilter = async () => {
    await getJobs(selectedDomain);
  };

  return (
    <PageLayout title="Danh sách Job">
      <>
        <Space direction="horizontal">
          <Select
            placeholder="Chọn nền tảng"
            options={domainOptions}
            onChange={handleDomainChange}
            value={selectedDomain}
          />
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </Space>
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
              key: 'code',
              render: (value, record, index) => (
                <Tooltip title={record.code}>
                  <span>
                    {record.code.length > 100 ? `${record.code.substring(0, 100)}...` : record.code}
                  </span>
                </Tooltip>
              ),
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
