import { Modal, Form, Input, InputNumber, DatePicker } from 'antd'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { getTFormReact } from '@/api/user/user.ts'

export function UserForm({
                             open,
                             onClose,
                             onOk,
                             initialValues
                         }: any) {
    const [form] = Form.useForm()

    useEffect(() => {
        if (!open) return

        form.resetFields()

        if (initialValues?.id) {
            fetchDetail(initialValues.id)
        }
    }, [open])

    // 👉 查询详情
    const fetchDetail = async (id: number) => {
        try {
            const res: any = await getTFormReact(id)

            form.setFieldsValue({
                ...res.data,
                birthday: res.data?.birthday
                    ? dayjs(res.data.birthday)
                    : null
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()

        // 👉 日期转字符串
        if (values.birthday) {
            values.birthday = values.birthday.format('YYYY-MM-DD')
        }

        onOk(values)
    }

    return (
        <Modal
            title={initialValues?.id ? 'ユーザー編集' : 'ユーザー追加'}
            open={open}
            onCancel={() => {
                form.resetFields()
                onClose()
            }}
            onOk={handleSubmit}
            okText="確定"
            cancelText="キャンセル"
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                {/* 名前 */}
                <Form.Item
                    name="name"
                    label="名前"
                    rules={[
                        { required: true, message: '名前を入力してください' }
                    ]}
                >
                    <Input placeholder="名前を入力" />
                </Form.Item>

                {/* 年齢 */}
                <Form.Item
                    name="age"
                    label="年齢"
                    rules={[
                        { required: true, message: '年齢を入力してください' },
                        { type: 'number', min: 0, max: 120, message: '0〜120の範囲で入力してください' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="年齢を入力"
                    />
                </Form.Item>

                {/* 生年月日 */}
                <Form.Item
                    name="birthday"
                    label="生年月日"
                    rules={[
                        { required: true, message: '日付を選択してください' }
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) =>
                            current && current > dayjs().endOf('day')
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
