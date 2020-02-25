import React, { Component } from 'react';
import { EditableProvider, EditableConsumer } from './editableContext';
import { Button, Input, Divider, Icon, Table, Form, Popconfirm, DatePicker } from 'antd';

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber onPressEnter={this.props.onPressEnter} name={this.props.dataIndex} onChange={this.props.onChangeInput} />;
    } else if (this.props.inputType === 'date') {
      return <DatePicker format="DD-MM-YYYY" />;
    }
    return <Input onPressEnter={this.props.onPressEnter} name={this.props.dataIndex} onChange={this.props.onChangeInput} />;
  };


  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      required,
      ...restProps
    } = this.props;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required,
                  message: `Por favor ingrese ${title}`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;

    return (
      <EditableConsumer>{ this.renderCell }</EditableConsumer>
    );
  }
}

export default EditableCell