import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Layout, Menu, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  QuestionCircleOutlined,
  ContactsOutlined,
  WechatOutlined,
  SisternodeOutlined,
  AccountBookOutlined,
  TagOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import './MainLayout.less';

const { Footer, Sider } = Layout;

const rootRoutes = ['/', '/about', '/contact'];
const aboutSubRoutes = ['/about/me', '/about/company'];

export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { children } = this.props;
    return (
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[
              aboutSubRoutes.includes(window.location.pathname)
                ? '1'
                : rootRoutes.indexOf(window.location.pathname).toString(),
            ]}
          >
            <Menu.Item key="0">
              <Link to="/client">
                <HomeOutlined />
                <span className="menu-item-link">Client</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="1">
              <Link to="/interaction">
                <QuestionCircleOutlined />
                <span className="menu-item-link">Thao tác</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/process">
                <ContactsOutlined />
                <span className="menu-item-link">Quy trình</span>
              </Link>
            </Menu.Item>

            <Space direction="horizontal">
              <Divider />
              Nghiệp vụ
              <Divider />
            </Space>
            <Menu.Item key="4">
              <Link to="/job">
                <SisternodeOutlined />
                <span className="menu-item-link">Job</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/quora">
                <WechatOutlined />
                <span className="menu-item-link">Quora</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/account">
                <AccountBookOutlined />
                <span className="menu-item-link">Tài khoản</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/tag">
                <TagOutlined />
                <span className="menu-item-link">Tag</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to="/link">
                <LinkOutlined />
                <span className="menu-item-link">Link</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>{children}</Layout>
      </Layout>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
