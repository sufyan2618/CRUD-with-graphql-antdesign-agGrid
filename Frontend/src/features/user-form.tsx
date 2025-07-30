import { Modal, Form, Input, Select } from 'antd';
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import useUserStore from '../entities/user/useUserStore';
import { CREATE_USER, UPDATE_USER } from '../entities/user/mutations';
import { GET_USERS } from '../entities/user/queries';
// Remove: import usePaginationAndFilters from '../shared/lib/hooks/usePaginationAndFilters';

const { Option } = Select;

const MyFormModal = () => {
    const [form] = Form.useForm();
    
    // Get everything from the global store
    const {
        addFormVisible,
        isEditing,
        editData,
        hideAddForm,
        toggleEditing,
        graphqlVariables,
        setPage // This now refers to the same state as UsersPage!
    } = useUserStore();

    useEffect(() => {
        if (isEditing && editData) {
            form.setFieldsValue({
                name: editData.name,
                email: editData.email,
                role: editData.role,
                status: editData.status,
            });
        }
    }, [isEditing, editData, form]);

    const [addUser, { loading: creating }] = useMutation(CREATE_USER, {
        refetchQueries: [{ 
            query: GET_USERS, 
            variables: { ...graphqlVariables, page: 1 }
        }],
        onCompleted: () => {
            toast.success('User added successfully!');
            setPage(1); // This now works! It updates the same state that UsersPage uses
            hideAddForm();
        },
        onError: (error) => {
            if (error.graphQLErrors?.[0]?.extensions?.code === 'BAD_USER_INPUT') {
                form.setFields([{ name: 'email', errors: [error.message] }]);
            } else {
                toast.error(`Error: ${error.message}`);
            }
        },
    });
    const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
        // For UPDATE: Refetch the current page (user should stay where they are)
        refetchQueries: [{ query: GET_USERS, variables: graphqlVariables }],
        onCompleted: () => {
            toast.success('User updated successfully!');
            hideAddForm()
            toggleEditing(); // Reset editing state
        },

        onError: (error) => {
            if (error.graphQLErrors?.[0]?.extensions?.code === 'BAD_USER_INPUT') {
                form.setFields([{ name: 'email', errors: [error.message] }]);
            } else {
                toast.error(`Error: ${error.message}`);
            }
        },
    });

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (isEditing && editData) {
                await updateUser({ variables: { id: editData.id, ...values } });
            } else {
                await addUser({ variables: values });
            }
        } catch (errorInfo) {
            console.log('Form validation failed:', errorInfo);
        }
    };

    const handleCancel = () => {
        hideAddForm();
        form.resetFields(); 
        toggleEditing(); 
    };

    return (
        <Modal
            title={isEditing ? 'Edit User' : 'Add New User'}
            open={ addFormVisible || isEditing }
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={creating || updating}
            destroyOnHidden
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
                        <Option value="moderator">Moderator</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                >
                    <Select placeholder="Select status">
                        <Option value="active">Active</Option>
                        <Option value="banned">Banned</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MyFormModal;
