import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Space, Button, message, Modal, Tag, Tooltip } from 'antd';
import PageLayout from '../../layout/PageLayout';
import { doGet, doPost, doDelete } from '../../service'; // Adjust the path based on your project structure
import TextEditor from '../../components/TextEditor';

const ReplyFormComponent = ({ record, callback }) => {
  const [form] = Form.useForm();

  const handleReply = async (quoraId, replyContent) => {
    try {
      await doPost(`/quoras-reply/${quoraId}`, { content: replyContent });
      message.success('Reply thành công');
      await callback();
    } catch (error) {
      message.error('Reply lỗi ' + error.message);
    }
  };

  const onFinish = (values) => {
    handleReply(record._id, values.content);
    form.resetFields(); // Reset the form fields after submission if needed
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="content">
        <TextEditor placeholder="Nhập phản hồi" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Phản hồi
        </Button>
      </Form.Item>
    </Form>
  );
};

const Quora = () => {
  const [quoras, setQuoras] = useState([]);

  async function getQuoras() {
    const response = await doGet('/quoras', { page: 1, pageSize: 1000 }); // Adjust the API endpoint and parameters as needed
    setQuoras(response.data);
  }

  useEffect(() => {
    getQuoras();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formAdd] = Form.useForm();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await formAdd.validateFields();
      await doPost('/quoras', values);
      await getQuoras();
      formAdd.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Lưu lỗi ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <PageLayout title="Quora List">
      <>
        <Space direction="vertical" style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={showModal}>
            Add Quora
          </Button>
        </Space>
        <Table
          columns={[
            {
              title: 'Từ khóa',
              dataIndex: 'keyword',
              width: 100,
              key: 'keyword',
            },
            {
              title: 'Số lượng comment',
              dataIndex: 'number_of_comment',
              width: 100,
              key: 'number_of_comment',
            },
            {
              title: 'Nội dung câu hỏi',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Link',
              dataIndex: 'url',
              width: 100,
              key: 'url',
            },
            {
              title: 'Trạng thái',
              width: 100,
              key: 'status',
              render: (value, record, index) => {
                return (
                  <div>
                    {record?.status == 'replied' ? (
                      <>
                        <Tag style={{ background: 'green', color: 'white' }}>Đã phản hồi</Tag>
                      </>
                    ) : (
                      <>
                        <Tag style={{ background: 'grey', color: 'white' }}>Chưa xử lý</Tag>
                      </>
                    )}
                  </div>
                );
              },
            },
            {
              title: 'Reply',
              width: 600,
              render: (value, record) => {
                return record?.reply ? (
                  <Space direction="vertical">
                    {/* <Space direction="horizontal">
                      <a href={record?.answer_url}>Link câu trả lời</a>
                    </Space> */}
                    <Tooltip title={record?.reply}>
                      <span>
                        {record?.reply.length > 100
                          ? `${record?.reply.substring(0, 100)}...`
                          : record?.reply}
                      </span>
                    </Tooltip>
                  </Space>
                ) : (
                  <ReplyFormComponent record={record} callback={getQuoras} />
                );
              },
            },
            // Add more columns as needed
            {
              title: 'Thao tác',
              width: 100,
              render: (value, record) => (
                <Space>
                  <Button
                    type="primary"
                    onClick={async () => {
                      await doPost(`/quoras-upvote/${record._id}`);
                      await getQuoras();
                    }}
                  >
                    Upvote
                  </Button>
                  <Button
                    type="ghost"
                    danger
                    onClick={async () => {
                      await doDelete(`/quoras/${record._id}`);
                      await getQuoras();
                    }}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={quoras}
          rowKey="_id"
        />
        <Modal title="Add Quora" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form form={formAdd}>
            <Form.Item
              label="Từ khóa"
              name="keyword"
              rules={[{ required: true, message: 'Please enter the keyword' }]}
            >
              <Input placeholder="Enter the keyword" />
            </Form.Item>

            <Form.Item
              label="Nội dung câu hỏi"
              name="title"
              rules={[{ required: true, message: 'Please enter the title' }]}
            >
              <Input placeholder="Enter the title" />
            </Form.Item>

            <Form.Item
              label="URL"
              name="url"
              rules={[{ required: true, message: 'Please enter the URL' }]}
            >
              <Input placeholder="Enter the URL" />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Please enter the status' }]}
            >
              <Input placeholder="Enter the status" />
            </Form.Item>

            <Form.Item label="Upvotes" name="number_of_upvote">
              <Input placeholder="Enter the number of upvotes" defaultValue={'0'} />
            </Form.Item>

            <Form.Item label="Comments" name="number_of_comment">
              <Input placeholder="Enter the number of comments" defaultValue={'0'} />
            </Form.Item>

            <Form.Item label="Client ID" name="client_id">
              <Input placeholder="Enter the client ID" />
            </Form.Item>

            <Form.Item label="Client Name" name="client_name">
              <Input placeholder="Enter the client name" />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </PageLayout>
  );
};

export default Quora;
