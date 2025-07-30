import { Modal, Form, Input, Select, message } from 'antd';
import useUserStore from '../entities/user/useUserStore'; 
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER } from '../entities/user/mutations'; 
import { GET_USERS } from '../entities/user/queries';
import usePaginationAndFilters from '../shared/lib/usePaginationAndFilters';
import { useEffect } from 'react';
const { Option } = Select;

const MyFormModal = () => {
  const [form] = Form.useForm();  
  const { addFormVisible, hideAddForm, editData, isEditing, toggleEditing } = useUserStore();
  const { graphqlVariables } = usePaginationAndFilters(); 

  useEffect(() => {
    if (isEditing && editData) {
      form.setFieldsValue({
        name: editData.name,
        email: editData.email,
        role: editData.role,
        status: editData.status,
      });
    } else {
      form.resetFields();
    }
  })


  const { refetch } = useQuery(GET_USERS, {
          variables: graphqlVariables,
          fetchPolicy: 'cache-and-network',
      });


    const [addUser] = useMutation(CREATE_USER, {
      variables: { name: '', email: '', role: '', status: ''}, 
      onCompleted: () => {
        message.success('User added successfully!');
        refetch(graphqlVariables);  
        hideAddForm(); 
        form.resetFields();
      },
      onError: (error) => {
        message.error(`Error adding user: ${error.message}`);
      }
    });

    const [UPDATE_USER] = useMutation(CREATE_USER, {
      variables: { id: '', name: '', email: '', role: '', status: '' },
      onCompleted: () => {
        message.success('User updated successfully!');
        refetch(graphqlVariables);  
        hideAddForm(); 
        form.resetFields();
      },
      onError: (error) => {
        message.error(`Error updating user: ${error.message}`);
      }
    });

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (isEditing && editData) {
          UPDATE_USER({
            variables: values,
          })
          message.success('User updated successfully!');
        } else {
          addUser({ variables: values });
          message.success('User added successfully!');
        }
        hideAddForm();
      })
      .catch(info => {
        message.error('Validation failed: ' + info.errorFields.map((field: { errors: string[] }) => field.errors).join(', '));
      });
  }

  const handleCancel = () => {
    if (isEditing) {
      toggleEditing(); // Reset editing state
    }
    hideAddForm();
    form.resetFields();
  };

  return (
    <Modal
      title="User Form"
      open={addFormVisible}
      onOk={handleOk}
      onCancel={handleCancel}

      destroyOnHidden={true}
    >
      <Form form={form} layout="vertical" name="user_form">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>


        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder="Select role">
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="guest">Guest</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MyFormModal;