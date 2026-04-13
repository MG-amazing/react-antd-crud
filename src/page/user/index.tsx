import { useEffect, useState } from 'react'
import {
    Table,
    Button,
    Space,
    Modal,
    message,
    Form,
    Input,
} from 'antd'
import dayjs from 'dayjs'
import { UserForm } from './form'

import {
    listTFormReact,
    addTFormReact,
    updateTFormReact,
    deleteTFormReact
} from '@/api/user/user.ts'


export default function UserPage() {
    const [list, setList] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState<any>(null)

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    })

    const [searchForm] = Form.useForm()

    const fetchData = async (extraParams: any = {}) => {
        setLoading(true)

        try {
            const values = searchForm.getFieldsValue()

            const params = {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                name: values.name,
                minAge: values.minAge,
                maxAge: values.maxAge,
                beginBirthday: values.birthday?.[0]?.format('YYYY-MM-DD'),
                endBirthday: values.birthday?.[1]?.format('YYYY-MM-DD'),
                ...extraParams
            }

            const res: any = await listTFormReact(params)

            setList(res.rows || [])
            setPagination(prev => ({
                ...prev,
                total: res.total || 0
            }))
        } catch (e) {
            message.error('データ取得に失敗しました')
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [pagination.current, pagination.pageSize])

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }))
        fetchData()
    }

    const handleReset = () => {
        searchForm.resetFields()
        handleSearch()
    }

    const handleDelete = (ids: number[]) => {
        Modal.confirm({
            title: '削除してもよろしいですか？',
            onOk: async () => {
                await deleteTFormReact(ids)
                message.success('削除が完了しました')
                setSelectedRowKeys([])
                fetchData()
            }
        })
    }

    const handleSubmit = async (values: any) => {
        if (current?.id) {
            await updateTFormReact({ ...values, id: current.id })
            message.success('更新が完了しました')
        } else {
            await addTFormReact(values)
            message.success('登録が完了しました')
        }

        setOpen(false)
        fetchData()
    }

    const columns = [
        {
            title: '番号',
            width: 80,
            render: (_: any, __: any, index: number) =>
                (pagination.current - 1) * pagination.pageSize + index + 1
        },
        { title: 'ID', dataIndex: 'id' },
        { title: '名前', dataIndex: 'name' },
        {
            title: '年齢',
            dataIndex: 'age',
            sorter: true
        },
        {
            title: '生年月日',
            dataIndex: 'birthday',
            sorter: true,
            render: (text: string) =>
                text ? dayjs(text).format('YYYY-MM-DD') : '-'
        },
        {
            title: '操作',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => {
                            setCurrent(record)
                            setOpen(true)
                        }}
                    >
                        編集
                    </Button>

                    <Button
                        danger
                        type="link"
                        onClick={() => handleDelete([record.id])}
                    >
                        削除
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <div style={{ padding: 24 }}>

            <Form layout="inline" form={searchForm}>
                <Form.Item name="name" label="名前">
                    <Input placeholder="名前" />
                </Form.Item>


                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={handleSearch}>
                            検索
                        </Button>
                        <Button onClick={handleReset}>リセット</Button>
                    </Space>
                </Form.Item>
            </Form>

            <Space style={{ margin: '16px 0' }}>
                <Button
                    type="primary"
                    onClick={() => {
                        setCurrent(null)
                        setOpen(true)
                    }}
                >
                    新規登録
                </Button>

                <Button
                    danger
                    disabled={!selectedRowKeys.length}
                    onClick={() => handleDelete(selectedRowKeys)}
                >
                    一括削除
                </Button>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={list}
                loading={loading}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys) => setSelectedRowKeys(keys as number[])
                }}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total) => `合計 ${total} 件`
                }}
                onChange={(pagination, _, sorter: any) => {
                    setPagination({
                        current: pagination.current!,
                        pageSize: pagination.pageSize!,
                        total: pagination.total!
                    })

                    fetchData({
                        orderByColumn: sorter.field,
                        isAsc: sorter.order === 'ascend' ? 'asc' : 'desc'
                    })
                }}
            />

            <UserForm
                open={open}
                initialValues={current}
                onClose={() => setOpen(false)}
                onOk={handleSubmit}
            />
        </div>
    )
}
